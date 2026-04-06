import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from backend.models.investigation import BillingAlert, Investigation
from backend.services.storage import StorageService
from backend.agents.orchestrator import Orchestrator
from typing import List

app = FastAPI(title="Argus AI - FinOps Agentic Platform")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services
storage = StorageService()
orchestrator = Orchestrator(storage)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/webhook/billing")
async def receive_billing_alert(alert: BillingAlert):
    """
    Receives billing alerts and triggers the ADK swarm.
    """
    inv_id = await orchestrator.handle_alert(alert)
    return {"message": "Investigation triggered", "investigation_id": inv_id}

@app.get("/investigations", response_model=List[Investigation])
def list_investigations():
    """
    Returns live state of all investigations from Firestore.
    """
    return storage.list_investigations()

@app.get("/investigations/{inv_id}", response_model=Investigation)
def get_investigation_details(inv_id: str):
    """
    Details of a specific investigation including thought signatures.
    """
    inv = storage.get_investigation(inv_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return inv

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
