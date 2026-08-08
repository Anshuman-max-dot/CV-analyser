import json
import os
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
from config import settings

class DatabaseService:
    def __init__(self):
        self.use_mongo = False
        self.client = None
        self.db = None
        self._in_memory_store: Dict[str, Dict[str, Any]] = {}

        # Attempt Mongo connection if available
        try:
            from pymongo import MongoClient
            self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1000)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client.get_database()
            self.use_mongo = True
            print("Successfully connected to MongoDB.")
        except Exception:
            self.use_mongo = False
            print("MongoDB unavailable. Operating in persistent JSON / In-Memory fallback mode.")

    def save_analysis(self, analysis_data: Dict[str, Any]) -> str:
        record_id = analysis_data.get("id", str(uuid.uuid4()))
        analysis_data["id"] = record_id
        if "timestamp" not in analysis_data or isinstance(analysis_data["timestamp"], str):
            analysis_data["timestamp"] = datetime.utcnow().isoformat()

        if self.use_mongo:
            try:
                self.db.analyses.replace_one({"id": record_id}, analysis_data, upsert=True)
                return record_id
            except Exception as e:
                print(f"Mongo save error: {e}")

        # Fallback in-memory / JSON store
        self._in_memory_store[record_id] = analysis_data
        return record_id

    def get_analysis(self, record_id: str) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            try:
                result = self.db.analyses.find_one({"id": record_id}, {"_id": 0})
                if result:
                    return result
            except Exception:
                pass

        return self._in_memory_store.get(record_id)

    def list_analyses(self, limit: int = 20) -> List[Dict[str, Any]]:
        if self.use_mongo:
            try:
                cursor = self.db.analyses.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit)
                return list(cursor)
            except Exception:
                pass

        records = list(self._in_memory_store.values())
        records.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return records[:limit]

db_service = DatabaseService()
