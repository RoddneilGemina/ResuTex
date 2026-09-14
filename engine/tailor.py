import json
import re
from typing import Dict, Any, List, Tuple
from engine.models import JobPosting, MatchResult

def load_candidate_profile(filepath: str = 'engine/data/candidate.json') -> Dict[str, Any]:
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

TECH_KEYWORDS = [
    'Python', 'Django', 'FastAPI', 'Flask', 'Java', 'Spring', 'C', 'C++', 'C#', '.NET',
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Vue', 'Angular',
    'AWS', 'Kubernetes', 'Docker', 'Linux', 'DevOps', 'SRE', 'CI/CD', 'Git', 'Bash',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'SQL',
    'AI', 'Artificial Intelligence', 'Machine Learning', 'Computer Vision', 'OCR', 'NLP',
    'QA', 'Testing', 'Jira', 'Automation', 'REST', 'GraphQL', 'Microservices', 'Distributed Systems'
]

def analyze_job_match(job: JobPosting, candidate: Dict[str, Any]) -> MatchResult:
    desc_lower = (job.role + ' ' + job.description).lower()
    
    # Collect candidate skills
    all_candidate_skills = []
    for cat, skills in candidate.get('skills', {}).items():
        all_candidate_skills.extend(skills)
    candidate_skills_str = ' '.join(all_candidate_skills).lower()
    
    matched = []
    missing = []
    
    for kw in TECH_KEYWORDS:
        pattern = r'\b' + re.escape(kw.lower()) + r'\b'
        if re.search(pattern, desc_lower):
            if re.search(pattern, candidate_skills_str):
                matched.append(kw)
            else:
                missing.append(kw)
                
    if matched or missing:
        raw_score = (len(matched) / (len(matched) + len(missing))) * 100
        score = min(98, max(72, int(raw_score * 0.8 + 20)))
    else:
        score = 86
        matched = ['Python', 'JavaScript', 'AWS', 'Docker', 'Linux', 'SQL']
        
    role_lower = job.role.lower()
    if any(k in role_lower for k in ['sre', 'devops', 'cloud', 'infrastructure', 'platform']):
        focus = 'cloud infrastructure, Kubernetes container orchestration, and reliability engineering from Opswerks'
        strengths = ['AWS & Kubernetes hands-on Opswerks SRE experience', 'PhilNITS FE certified systems architecture', 'Python/Bash infrastructure automation']
    elif any(k in role_lower for k in ['ai', 'machine learning', 'data', 'vision', 'agent']):
        focus = 'applied artificial intelligence, OCR inference engines, and Scopus-published research'
        strengths = ['Scopus ICETT 2026 published AI paper author', 'Visual AI logic proof verification parser', 'Strong Python discrete algorithms foundation']
    elif any(k in role_lower for k in ['backend', 'python', 'django', 'api']):
        focus = 'robust backend services, RESTful API design, and distributed systems programming'
        strengths = ['Production Python & Django backend engineering', 'PostgreSQL database modeling & caching', 'Containerized microservice deployments on AWS']
    else:
        focus = 'full-stack web applications, responsive user interfaces, and scalable backend services'
        strengths = ['End-to-end full stack development (React, Node.js, Python, Supabase)', 'Quality Assurance OJT experience at DXForm', 'TOPCIT L3 & PhilNITS FE certifications']
        
    tailored_summary = (
        f"Computer Science graduate from CIT-U with hands-on expertise in {focus}. "
        f"Demonstrated ability delivering high-reliability systems, verified through industry internships at Opswerks (SRE) "
        f"and DXForm (QA), alongside international research recognition. Eager to contribute scalable, test-driven code to {job.company} as {job.role}."
    )
    
    return MatchResult(
        score=score,
        matched_skills=matched[:8],
        missing_skills=missing[:4],
        tailored_summary=tailored_summary,
        key_strengths=strengths
    )

def generate_cold_email(job: JobPosting, match: MatchResult, candidate: Dict[str, Any]) -> str:
    p = candidate['personal']
    contact = job.hiring_contact if job.hiring_contact and job.hiring_contact != 'Hiring Manager' else f"{job.company} Hiring Team"
    clean_company = job.company.lower().replace(' ', '')
    skills_text = ', '.join(match.matched_skills[:4]) if match.matched_skills else 'Python, cloud infrastructure, and modern web architectures'
    
    return f"""# Cold Outreach Email Draft

**To:** {contact} <recruiting@{clean_company}.com>
**Subject:** Application: {job.role} — {p['name']} (Remote / Philippines)

Dear {contact},

I recently reviewed the opening for the **{job.role}** role at **{job.company}** via your direct careers board and wanted to reach out directly to express my strong enthusiasm.

As a Computer Science graduate from Cebu Institute of Technology - University with certified credentials (PhilNITS Fundamental Engineer, TOPCIT Level 3, and AWS Academy Graduate), my technical background aligns directly with the requirements for this position:

- **Targeted Technical Alignment:** Extensive hands-on experience in **{skills_text}**, with a focus on writing clean, scalable, and resilient software.
- **Industry SRE & QA Experience:** Practiced Site Reliability Engineering at **Opswerks** (managing AWS, Kubernetes, Docker, and Linux telemetry) and completed 250 OJT hours as a QA Analyst at **DXForm Technologies** validating multi-platform enterprise products.
- **Applied AI & Systems Research:** Author of a Scopus-indexed research paper (**ICETT 2026**) on educational AI systems and presenter of a Visual AI logic parser at **PCSC 2026**.

I am based in the Philippines and fully set up for high-cadence, autonomous remote software engineering work. I have attached my tailored ATS resume and cover letter for your review.

Would you be open to a brief 10-minute introductory conversation this week to discuss how my skill set can support {job.company}'s engineering goals?

Thank you for your time and consideration.

Best regards,

**{p['name']}**
{p['email']} | {p['phone']}
LinkedIn: {p['linkedin']}
GitHub: {p['github']}
Portfolio: {p['portfolio']}
"""
