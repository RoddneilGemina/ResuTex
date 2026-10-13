# ResuTex | Autonomous ATS Resume Engine & Studio

An autonomous software engineering job application pipeline and interactive LaTeX resume studio. 
Searches direct ATS boards (Ashby, Workable, Greenhouse, Lever), matches candidate qualifications, dynamically tailors ATS resumes and cover letters, compiles PDFs with ReportLab, drafts cold outreach emails, and logs applications to Supabase and local ledgers.

---

## 📁 Repository Architecture

```
ResuTex/
├── web/                           # Next.js 16 (Turbopack) Studio with Figma Design System
├── engine/
│   ├── __init__.py                # Exposes process_job() and key symbols
│   ├── data/
│   │   └── candidate.json         # Master candidate profile
│   ├── templates/
│   │   ├── resume.tex             # Master ATS resume LaTeX template
│   │   └── cover_letter.tex       # Master ATS cover letter LaTeX template
│   ├── models.py                  # JobPosting, MatchResult, TailoredPackage dataclasses
│   ├── tailor.py                  # ATS Match scoring, profile analysis, cold email writer
│   ├── compiler.py                # LaTeX generator & ReportLab ATS PDF compiler
│   ├── supabase_client.py         # Supabase REST client with local sync fallback
│   └── ingestion.py               # process_job() entrypoint
├── output/                        # Generated application packages
│   ├── applications.json          # Master application ledger
│   └── [company]_[role]/          # Per-job folder containing:
│       ├── resume.tex
│       ├── resume.pdf
│       ├── cover_letter.tex
│       ├── cover_letter.pdf
│       └── cold_email.md
├── run_pipeline.py                # Batch pipeline execution script
├── .env.example                   # Environment configuration template
└── README.md                      # Documentation
```

---

## 🚀 Quickstart

### 1. Requirements
- Python 3.10+
- Dependencies: `reportlab`, `jinja2`, `requests`

```powershell
pip install reportlab jinja2 requests
```

### 2. Optional: Connect Supabase
To sync applications to your Supabase project:
1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Add your `SUPABASE_URL` and `SUPABASE_KEY`.
*(If unset, all records are stored persistently in `output/applications.json`)*.

### 3. Run the Autonomous Pipeline
```powershell
python run_pipeline.py
```

### 4. Process Any Custom Job On-The-Fly
```python
from engine import process_job

package = process_job(
    company="Company Name",
    role="Software Engineer",
    direct_url="https://jobs.ashbyhq.com/company/123",
    description="Python, AWS, React...",
    salary="₱180,000 / month",
    hiring_contact="Jane Doe",
    source_board="Ashby"
)

print(f"Match Score: {package.match_result.score}%")
print(f"Generated PDF: {package.resume_pdf_path}")
```
