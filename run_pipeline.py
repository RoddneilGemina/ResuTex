import os
import sys

# Ensure UTF-8 output encoding across Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from engine import process_job

TARGET_JOBS = [
    {
        "company": "Bjak",
        "role": "Backend Software Engineer (AI Finance Agent)",
        "direct_url": "https://jobs.ashbyhq.com/bjak/9f7e8b62-dfae-47c3-8bc6-9ebf40f09ee3",
        "source_board": "Ashby",
        "salary": "PHP 180,000 - 240,000 / mo",
        "hiring_contact": "Bjak AI & Engineering Hiring Team",
        "description": (
            "We are seeking a Backend Software Engineer to design, build, and deploy autonomous AI Finance Agents. "
            "Responsibilities include engineering high-throughput distributed microservices in Python, designing robust REST APIs, "
            "implementing vector databases, optimizing PostgreSQL queries, orchestrating containerized services on Docker and Kubernetes, "
            "and maintaining high availability on AWS. Candidates with background in AI research, inference optimization, or SRE are strongly preferred."
        )
    },
    {
        "company": "Double the Donation",
        "role": "Software Engineer / Software Developer",
        "direct_url": "https://jobs.ashbyhq.com/double-the-donation/7b2e1f44-9382-416b-bc54-3e9a7e6bdf21",
        "source_board": "Ashby",
        "salary": "PHP 200,000 / mo (PHP 2.4M / yr)",
        "hiring_contact": "Technical Recruiting Team",
        "description": (
            "Double the Donation is hiring a full-time Remote Software Engineer in the Philippines. "
            "You will write clean, well-tested Python and JavaScript/React code, architect relational database schemas (PostgreSQL), "
            "build integration webhooks with major CRM and ticketing platforms, develop automated test suites, and deploy services on AWS. "
            "We value foundational computer science knowledge, test-driven development, and strong communication."
        )
    },
    {
        "company": "Wingz PH",
        "role": "Software Engineer (Django)",
        "direct_url": "https://apply.workable.com/wingz/j/69E4C5635F/",
        "source_board": "Workable",
        "salary": "PHP 150,000 - 200,000 / mo",
        "hiring_contact": "Wingz Engineering Leadership",
        "description": (
            "Wingz is expanding its core engineering team in the Philippines. We are looking for a Software Engineer specializing in Python and Django. "
            "In this role, you will develop mission-critical backend APIs, manage database transactions in PostgreSQL, optimize query performance, "
            "automate CI/CD pipelines, and maintain cloud infrastructure on AWS. Experience in Linux administration and quality assurance is an advantage."
        )
    },
    {
        "company": "Foundry for Good",
        "role": "Software Engineer",
        "direct_url": "https://jobs.ashbyhq.com/foundry-for-good/3a8c4f19-b22e-4089-8d77-6f81a704e6c1",
        "source_board": "Ashby",
        "salary": "PHP 200,000 / mo (PHP 2.4M / yr)",
        "hiring_contact": "Foundry Talent Acquisition",
        "description": (
            "Foundry for Good is hiring a remote Software Engineer in the Philippines to build impactful digital platforms. "
            "You will work across the full stack utilizing modern TypeScript, React, Python, and cloud services (AWS/Docker). "
            "Responsibilities include writing robust unit/integration tests, conducting code reviews, implementing reliable database migrations, "
            "and ensuring stellar application performance and security."
        )
    },
    {
        "company": "Remotely",
        "role": "Full Stack Developer",
        "direct_url": "https://apply.workable.com/remotely/j/9E4C87321A/",
        "source_board": "Workable",
        "salary": "PHP 140,000 - 180,000 / mo",
        "hiring_contact": "Engineering Recruitment",
        "description": (
            "Remotely is looking for an exceptional Full Stack Developer based in the Philippines. "
            "You will develop scalable web applications using React, Node.js, and Python, design PostgreSQL data models, integrate third-party APIs, "
            "collaborate with QA engineers to maintain zero-defect standards, and deploy automated microservices using Docker and cloud platforms."
        )
    }
]

def main():
    print("===================================================================")
    print("[*] AUTONOMOUS JOB HUNTING PIPELINE: REMOTE SOFTWARE ENGINEERING (PH)")
    print("===================================================================")
    
    results = []
    
    for item in TARGET_JOBS:
        package = process_job(
            company=item["company"],
            role=item["role"],
            direct_url=item["direct_url"],
            description=item["description"],
            salary=item["salary"],
            hiring_contact=item["hiring_contact"],
            source_board=item["source_board"]
        )
        results.append(package)
        
    print("\n===================================================================")
    print("[OK] ALL TARGET ROLES PROCESSED SUCCESSFULLY!")
    print("===================================================================")
    print(f"Total Applications Tailored & Compiled: {len(results)}\n")
    
    for r in results:
        print(f"[{r.match_result.score}% Match] {r.job.company} -- {r.job.role}")
        print(f"    Direct ATS Link: {r.job.direct_url}")
        print(f"    Salary: {r.job.salary}")
        print(f"    Resume PDF: {r.resume_pdf_path}")
        print(f"    Cover Letter PDF: {r.cover_letter_pdf_path}")
        print(f"    Cold Email: {r.cold_email_path}")
        print()

if __name__ == "__main__":
    main()
