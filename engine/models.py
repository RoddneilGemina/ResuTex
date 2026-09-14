from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class JobPosting:
    company: str
    role: str
    direct_url: str
    description: str
    salary: str = 'Competitive'
    hiring_contact: str = 'Hiring Manager'
    source_board: str = 'Direct ATS'
    slug: str = ''

    def __post_init__(self):
        if not self.slug:
            clean_company = ''.join(c for c in self.company.lower() if c.isalnum() or c in ' -_').replace(' ', '_')
            clean_role = ''.join(c for c in self.role.lower() if c.isalnum() or c in ' -_').replace(' ', '_')
            self.slug = f'{clean_company}_{clean_role}'[:50]

@dataclass
class MatchResult:
    score: int
    matched_skills: List[str]
    missing_skills: List[str]
    tailored_summary: str
    key_strengths: List[str]

@dataclass
class TailoredPackage:
    job: JobPosting
    match_result: MatchResult
    resume_tex_path: str
    resume_pdf_path: str
    cover_letter_tex_path: str
    cover_letter_pdf_path: str
    cold_email_path: str
    cold_email_content: str
    recorded_to_supabase: bool
    supabase_record_id: Optional[str] = None
