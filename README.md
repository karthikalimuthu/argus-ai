Argus AI — Autonomous Cloud FinOps Commander
Argus AI is a multi-agent system designed to autonomously monitor, analyze, and optimize Google Cloud Platform (GCP) spending. By shifting from passive monitoring to active remediation, Argus AI closes the loop between identifying cloud waste and executing fixes.

🚀 Overview
Enterprises typically lose 30-35% of cloud budgets to idle VMs, over-provisioned storage, and forgotten services. Argus AI uses a "swarm" of specialized agents to investigate cost anomalies, verify them against company policy and schedules, and create actionable tasks.

🧠 Core Features
Autonomous Watchman: 24/7 monitoring of Cloud Billing data via Gemini 3.1 Flash.

Policy-Aware RAG: Uses AlloyDB AI to ensure all optimization recommendations align with corporate governance.

Schedule-Sync: Integrated with Google Calendar via MCP to prevent false alarms during planned migrations or load tests.

Closed-Loop Remediation: Automatically generates Jira/GitHub tickets for resource owners when waste is confirmed.

🛠️ Technology Stack
Intelligence: Gemini 3.1 Flash (Vertex AI).

Orchestration: Google ADK (Agent Development Kit).

Tooling: Model Context Protocol (MCP).

Database: AlloyDB AI (Vector Store) & Firestore (State Management).

Backend: FastAPI (Python).

Frontend: React + Tailwind CSS.

Infrastructure: Google Cloud Run, Cloud Build, and Artifact Registry.
