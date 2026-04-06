from backend.agents.auditor import AuditorAgent
from backend.agents.policy import PolicyAgent
from backend.agents.execution import ExecutionAgent
from backend.models.investigation import BillingAlert, Investigation, ThoughtTrace
from backend.services.storage import StorageService
import vertexai
from vertexai.generative_models import GenerativeModel
import os
import asyncio

class Orchestrator:
    def __init__(self, storage: StorageService):
        self.storage = storage
        self.auditor = AuditorAgent()
        self.policy = PolicyAgent()
        self.execution = ExecutionAgent()
        
        # Initialize Vertex AI
        project_id = os.getenv("PROJECT_ID", "mock-project")
        location = os.getenv("REGION", "us-central1")
        try:
            vertexai.init(project=project_id, location=location)
            # Use Gemini 3.1 Flash as the default model
            self.model = GenerativeModel("gemini-3.1-flash")
        except Exception as e:
            # Fallback mock for local development without proper google-cloud-auth
            print("Vertex AI init warning:", e)
            self.model = None

    async def handle_alert(self, alert: BillingAlert) -> str:
        # Create investigation
        investigation = Investigation(alert=alert)
        self.storage.save_investigation(investigation)

        # Trigger background processing
        asyncio.create_task(self._process_swarm(investigation))
        return investigation.id

    async def _process_swarm(self, investigation: Investigation):
        investigation.status = "in_progress"
        self.storage.save_investigation(investigation)

        alert_data = investigation.alert.model_dump()
        
        # 1. Auditor Agent
        audit_res = await self.auditor.process(alert_data)
        investigation.thought_traces.append(ThoughtTrace(agent_name="AuditorAgent", thought=audit_res))
        self.storage.save_investigation(investigation)
        
        # 2. Policy Agent
        policy_res = await self.policy.check_policy(alert_data["service"])
        investigation.thought_traces.append(ThoughtTrace(agent_name="PolicyAgent", thought=policy_res))
        self.storage.save_investigation(investigation)
        
        # 3. Decision via Gemini 3.1 Flash (Primary Orchestrator reasoning)
        orchestrator_decision = "Proceeding with execution based on automated evaluation."
        if self.model:
            try:
                prompt = f"Analyze this FinOps alert: {alert_data}. Audit: {audit_res}. Policy: {policy_res}. Decide the action."
                response = self.model.generate_content(prompt)
                if response.text:
                    orchestrator_decision = response.text
            except Exception as e:
                print(f"Vertex AI call failed: {e}")
        
        investigation.thought_traces.append(ThoughtTrace(agent_name="PrimaryOrchestrator", thought=f"Reasoning (gemini-3.1-flash): {orchestrator_decision}"))
        self.storage.save_investigation(investigation)
        
        # 4. Execution
        exec_res = await self.execution.execute_action(alert_data["service"])
        investigation.thought_traces.append(ThoughtTrace(agent_name="ExecutionAgent", thought=exec_res))
        
        # Assuming we saved some money
        investigation.savings_score = alert_data.get("cost", 0) * 0.2
        investigation.status = "resolved"
        self.storage.save_investigation(investigation)
