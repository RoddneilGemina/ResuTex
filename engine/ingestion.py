import os
from typing import Optional, Dict, Any
from engine.models import JobPosting, TailoredPackage
from engine.tailor import load_candidate_profile, analyze_job_match, generate_cold_email
from engine.compiler import build_documents
from engine.supabase_client import SupabaseApplicationClient

def process_job(
    company: str,
    role: str,
    direct_url: str,
    description: str,
    salary: str = "Competitive",
    hiring_contact: str = "Hiring Manager",
    source_board: str = "Direct ATS",
    candidate_profile_path: str = "engine/data/candidate.json"
) -> TailoredPackage:
    """
    Executes the autonomous job application pipeline for a single target role:
    1. Loads candidate profile
    2. Analyzes match and extracts tailored strengths
    3. Renders LaTeX templates & compiles ATS-compliant PDFs
    4. Drafts cold outreach email
    5. Records the application to Supabase & local ledger
    """
    print(f"\n=======================================================")
    print(f"[*] Processing Target Role: {role} at {company}")
    print(f"[*] Direct URL: {direct_url}")
    print(f"=======================================================")
    
    # 1. Instantiate Job Posting
    job = JobPosting(
        company=company,
        role=role,
        direct_url=direct_url,
        description=description,
        salary=salary,
        hiring_contact=hiring_contact,
        source_board=source_board
    )
    
    # 2. Load Candidate Profile
    candidate = load_candidate_profile(candidate_profile_path)
    
    # 3. Match Analysis & Tailoring
    match = analyze_job_match(job, candidate)
    print(f"[+] Match Score: {match.score}%")
    print(f"[+] Matched Skills: {', '.join(match.matched_skills)}")
    
    # 4. Compile Documents
    job_dir = os.path.join("output", job.slug)
    resume_tex, resume_pdf, cover_tex, cover_pdf = build_documents(job, match, candidate, job_dir)
    print(f"[+] Compiled ATS Resume PDF: {resume_pdf}")
    print(f"[+] Compiled ATS Cover Letter PDF: {cover_pdf}")
    
    # 5. Draft Cold Email
    cold_email_content = generate_cold_email(job, match, candidate)
    cold_email_path = os.path.join(job_dir, "cold_email.md")
    with open(cold_email_path, "w", encoding="utf-8") as f:
        f.write(cold_email_content)
    print(f"[+] Drafted Cold Outreach Email: {cold_email_path}")
    
    # 6. Record to Supabase
    sb_client = SupabaseApplicationClient()
    success, record_id = sb_client.record_application(job, match, resume_pdf, cover_pdf, cold_email_path)
    print(f"[+] Recorded to Application Store: {record_id} (Success: {success})")
    
    package = TailoredPackage(
        job=job,
        match_result=match,
        resume_tex_path=resume_tex,
        resume_pdf_path=resume_pdf,
        cover_letter_tex_path=cover_tex,
        cover_letter_pdf_path=cover_pdf,
        cold_email_path=cold_email_path,
        cold_email_content=cold_email_content,
        recorded_to_supabase=success,
        supabase_record_id=record_id
    )
    
    return package
