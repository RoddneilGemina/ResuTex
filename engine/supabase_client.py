import os
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, Tuple
import requests
from engine.models import JobPosting, MatchResult

class SupabaseApplicationClient:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
        self.supabase_key = os.environ.get("SUPABASE_KEY", "").strip()
        self.ledger_path = os.path.join("output", "applications.json")
        
    def _save_to_local_ledger(self, record: Dict[str, Any]):
        os.makedirs("output", exist_ok=True)
        records = []
        if os.path.exists(self.ledger_path):
            try:
                with open(self.ledger_path, "r", encoding="utf-8") as f:
                    records = json.load(f)
            except Exception:
                records = []
        records.append(record)
        with open(self.ledger_path, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)

    def record_application(
        self,
        job: JobPosting,
        match: MatchResult,
        resume_pdf_path: str,
        cover_letter_pdf_path: str,
        cold_email_path: str
    ) -> Tuple[bool, str]:
        record_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        record = {
            "id": record_id,
            "created_at": timestamp,
            "company": job.company,
            "role": job.role,
            "direct_url": job.direct_url,
            "source_board": job.source_board,
            "salary": job.salary,
            "hiring_contact": job.hiring_contact,
            "match_score": match.score,
            "matched_skills": match.matched_skills,
            "missing_skills": match.missing_skills,
            "status": "tailored_ready_to_apply",
            "assets": {
                "resume_pdf": os.path.abspath(resume_pdf_path),
                "cover_letter_pdf": os.path.abspath(cover_letter_pdf_path),
                "cold_email": os.path.abspath(cold_email_path)
            }
        }
        
        # Always record to local ledger for persistence
        self._save_to_local_ledger(record)
        
        # Try Supabase sync if credentials exist
        if self.supabase_url and self.supabase_key:
            endpoint = f"{self.supabase_url}/rest/v1/job_applications"
            headers = {
                "apikey": self.supabase_key,
                "Authorization": f"Bearer {self.supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            try:
                resp = requests.post(endpoint, json=record, headers=headers, timeout=8)
                if resp.status_code in [200, 201]:
                    return True, record_id
                else:
                    print(f"[Supabase sync warning] HTTP {resp.status_code}: {resp.text}")
                    return True, f"local_ledger_{record_id[:8]}"
            except Exception as e:
                print(f"[Supabase sync notice] Connection skipped ({e}). Saved to local ledger.")
                return True, f"local_ledger_{record_id[:8]}"
        else:
            return True, f"local_ledger_{record_id[:8]}"
