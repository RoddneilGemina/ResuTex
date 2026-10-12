import sys
import os
import json
import argparse

# Ensure engine is on python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.models import JobPosting, MatchResult
from engine.compiler import compile_ats_resume_pdf, compile_ats_cover_letter_pdf

def main():
    parser = argparse.ArgumentParser(description="Compile Resume or Cover Letter PDF via ReportLab ATS Engine")
    parser.add_argument("--input", required=True, help="Path to input candidate JSON file")
    parser.add_argument("--output", required=True, help="Path to output PDF file")
    parser.add_argument("--type", default="resume", choices=["resume", "cover_letter"], help="Document type")
    parser.add_argument("--company", default="Company", help="Target company")
    parser.add_argument("--role", default="Software Engineer", help="Target role")

    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        candidate_data = json.load(f)

    job = JobPosting(
        company=args.company,
        role=args.role,
        direct_url="https://example.com",
        description="",
        salary=None,
        hiring_contact=f"{args.company} Hiring Team",
        source_board="WebStudio"
    )

    match = MatchResult(
        score=95,
        matched_skills=["TypeScript", "React", "Python", "Docker", "AWS"],
        missing_skills=[],
        tailored_summary="Resume compiled successfully",
        key_strengths=["Full-Stack Engineering", "Site Reliability"]
    )

    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)

    if args.type == "cover_letter":
        compile_ats_cover_letter_pdf(job, match, candidate_data, args.output)
    else:
        compile_ats_resume_pdf(job, match, candidate_data, args.output)

    print(f"SUCCESS: {args.output}")

if __name__ == "__main__":
    main()
