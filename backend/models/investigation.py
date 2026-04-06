from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class BillingAlert(BaseModel):
    account_id: str
    service: str
    cost: float
    threshold_exceeded: bool
    description: str

class ThoughtTrace(BaseModel):
    agent_name: str
    thought: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Investigation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending" # pending, in_progress, resolved
    alert: BillingAlert
    thought_traces: List[ThoughtTrace] = []
    savings_score: float = 0.0
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
