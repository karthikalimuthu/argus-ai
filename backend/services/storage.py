from backend.models.investigation import Investigation
from google.cloud import firestore
import os
import logging

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        project_id = os.getenv("PROJECT_ID", "mock-project")
        try:
            self.db = firestore.Client(project=project_id)
            self.collection = self.db.collection("investigations")
        except Exception as e:
            logger.warning(f"Failed to initialize Firestore, using in-memory mock: {e}")
            self.db = None
            self._mock_db = {}

    def save_investigation(self, investigation: Investigation):
        if self.db:
            doc_ref = self.collection.document(investigation.id)
            doc_ref.set(investigation.model_dump())
        else:
            self._mock_db[investigation.id] = investigation.model_dump()

    def get_investigation(self, inv_id: str) -> Investigation | None:
        if self.db:
            doc = self.collection.document(inv_id).get()
            if doc.exists:
                return Investigation(**doc.to_dict())
            return None
        else:
            data = self._mock_db.get(inv_id)
            return Investigation(**data) if data else None

    def list_investigations(self) -> list[Investigation]:
        if self.db:
            docs = self.collection.stream()
            return [Investigation(**doc.to_dict()) for doc in docs]
        else:
            return [Investigation(**data) for data in self._mock_db.values()]
