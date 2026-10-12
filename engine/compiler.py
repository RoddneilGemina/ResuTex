import os
import shutil
import subprocess
from typing import Dict, Any
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from engine.models import JobPosting, MatchResult

# Try registering Garamond fonts from Windows directory if available
FONT_SERIF = 'Times-Roman'
FONT_SERIF_BOLD = 'Times-Bold'
FONT_SERIF_ITALIC = 'Times-Italic'

try:
    if os.path.exists(r'C:\Windows\Fonts\GARA.TTF') and os.path.exists(r'C:\Windows\Fonts\GARABD.TTF'):
        pdfmetrics.registerFont(TTFont('Garamond', r'C:\Windows\Fonts\GARA.TTF'))
        pdfmetrics.registerFont(TTFont('Garamond-Bold', r'C:\Windows\Fonts\GARABD.TTF'))
        if os.path.exists(r'C:\Windows\Fonts\GARAIT.TTF'):
            pdfmetrics.registerFont(TTFont('Garamond-Italic', r'C:\Windows\Fonts\GARAIT.TTF'))
        else:
            pdfmetrics.registerFont(TTFont('Garamond-Italic', r'C:\Windows\Fonts\GARA.TTF'))
        FONT_SERIF = 'Garamond'
        FONT_SERIF_BOLD = 'Garamond-Bold'
        FONT_SERIF_ITALIC = 'Garamond-Italic'
except Exception as e:
    pass

def escape_latex(text: str) -> str:
    chars = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
    }
    for k, v in chars.items():
        text = text.replace(k, v)
    return text

def render_resume_tex(job: JobPosting, match: MatchResult, candidate: Dict[str, Any], output_path: str):
    p = candidate['personal']
    
    # 1. Experience
    exp_lines = []
    for exp in candidate.get('experience', []):
        exp_lines.append(r'\textbf{' + escape_latex(exp['company'] + ' -- ' + exp['role']) + r'} | ' + escape_latex(exp.get('location', '')) + r'\\')
        exp_lines.append(r'\textit{' + escape_latex(exp['period']) + r'}')
        exp_lines.append(r'\begin{itemize}')
        for b in exp.get('bullets', []):
            exp_lines.append(r'  \item ' + escape_latex(b))
        exp_lines.append(r'\end{itemize}')
        exp_lines.append(r'\vspace{4pt}')
    experience_section = '\n'.join(exp_lines)

    # 2. Projects
    proj_lines = []
    for proj in candidate.get('projects', []):
        tech_str = ', '.join(proj.get('tech', []))
        role_str = proj.get('role', 'Developer')
        proj_lines.append(r'\textbf{' + escape_latex(proj['name'] + ' -- ' + role_str) + r'} | \textit{' + escape_latex(tech_str) + r'}')
        proj_lines.append(r'\begin{itemize}')
        for b in proj.get('bullets', []):
            exp_bullets = escape_latex(b) if isinstance(b, str) else escape_latex(str(b))
            proj_lines.append(r'  \item ' + exp_bullets)
        proj_lines.append(r'\end{itemize}')
        proj_lines.append(r'\vspace{4pt}')
    projects_section = '\n'.join(proj_lines)

    # 3. Skills
    skills_dict = candidate.get('skills', {})
    skill_rows = []
    for cat_name, skill_list in skills_dict.items():
        title = cat_name.replace('_', ' ').title()
        skill_rows.append(r'\textbf{' + escape_latex(title) + r':} ' + escape_latex(', '.join(skill_list)) + r' \\')
    skills_section = '\n'.join(skill_rows)

    # 4. Education
    edu_lines = []
    for edu in candidate.get('education', []):
        edu_lines.append(r'\textbf{' + escape_latex(edu['institution']) + r'} -- ' + escape_latex(edu['degree']) + r' \hfill ' + escape_latex(edu['period']) + r' \\')
    education_section = '\n'.join(edu_lines)

    # 5. Research & Competitions
    research_lines = []
    for res in candidate.get('research', []):
        title_full = res.get('title', '')
        if res.get('location'):
            title_full += f" | {res['location']}"
        research_lines.append(r'\textbf{' + escape_latex(title_full) + r'} \\')
        research_lines.append(escape_latex(res.get('description', '')) + r' \\ \vspace{3pt}')
    research_section = '\n'.join(research_lines)

    # 6. Certifications
    cert_lines = []
    for cert in candidate.get('certifications', []):
        cert_lines.append(escape_latex(cert['title']) + r' \hfill \textbf{' + escape_latex(cert.get('date', '')) + r'} \\')
    certifications_section = '\n'.join(cert_lines)

    # 7. Volunteering
    vol_lines = []
    for vol in candidate.get('volunteering', []):
        vol_lines.append(r'\textbf{' + escape_latex(vol['organization']) + r'} \hfill ' + escape_latex(vol.get('period', '')) + r'\\')
        if vol.get('bullets'):
            vol_lines.append(r'\begin{itemize}')
            for b in vol['bullets']:
                vol_lines.append(r'  \item ' + escape_latex(b))
            vol_lines.append(r'\end{itemize}')
        vol_lines.append(r'\vspace{3pt}')
    volunteering_section = '\n'.join(vol_lines)
    
    with open('engine/templates/resume.tex', 'r', encoding='utf-8') as f:
        template = f.read()
        
    portfolio_url = p.get('portfolio', 'https://roddneilgemina.github.io')
    github_url = p.get('github', 'https://github.com/RoddneilGemina')
    linkedin_url = p.get('linkedin', 'https://www.linkedin.com/in/roddneil-gemina-20b423409')
    
    filled = template.replace('<<NAME>>', escape_latex(p['name']))
    filled = filled.replace('<<LOCATION>>', escape_latex(p.get('location', 'Cebu City, PH')))
    filled = filled.replace('<<PHONE>>', escape_latex(p['phone']))
    filled = filled.replace('<<EMAIL>>', escape_latex(p['email']))
    filled = filled.replace('<<PORTFOLIO>>', escape_latex(portfolio_url))
    filled = filled.replace('<<PORTFOLIO_LABEL>>', escape_latex(portfolio_url.replace('https://', '')))
    filled = filled.replace('<<GITHUB>>', escape_latex(github_url))
    filled = filled.replace('<<GITHUB_LABEL>>', escape_latex(github_url.replace('https://', '')))
    filled = filled.replace('<<LINKEDIN>>', escape_latex(linkedin_url))
    filled = filled.replace('<<LINKEDIN_LABEL>>', escape_latex(linkedin_url.replace('https://www.', '').replace('https://', '')))
    
    filled = filled.replace('<<EXPERIENCE_SECTION>>', experience_section)
    filled = filled.replace('<<PROJECTS_SECTION>>', projects_section)
    filled = filled.replace('<<SKILLS_SECTION>>', skills_section)
    filled = filled.replace('<<EDUCATION_SECTION>>', education_section)
    filled = filled.replace('<<RESEARCH_SECTION>>', research_section)
    filled = filled.replace('<<CERTIFICATIONS_SECTION>>', certifications_section)
    filled = filled.replace('<<VOLUNTEERING_SECTION>>', volunteering_section)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(filled)

def render_cover_letter_tex(job: JobPosting, match: MatchResult, candidate: Dict[str, Any], output_path: str):
    p = candidate['personal']
    contact = job.hiring_contact if job.hiring_contact and job.hiring_contact != 'Hiring Manager' else f"{job.company} Hiring Team"
    
    opening = (
        f"I am writing to express my enthusiastic interest in the {job.role} position at {job.company}. "
        f"With a strong academic foundation in Computer Science from Cebu Institute of Technology - University, "
        f"hands-on engineering experience spanning Site Reliability Engineering at Opswerks and Software QA at DXForm Technologies, "
        f"and Scopus-indexed research in intelligent systems, I am eager to deliver immediate value to your distributed engineering team."
    )
    
    skills_str = ', '.join(match.matched_skills[:4]) if match.matched_skills else 'Python, AWS, containerization, and modern software architectures'
    body_1 = (
        f"Throughout my academic and professional journey, I have focused on engineering resilient, test-driven systems. "
        f"During my SRE internship at Opswerks, I administered Linux servers, managed Kubernetes pods, configured Docker container pipelines, "
        f"and leveraged AWS services to sustain high application availability. Coupled with completing 250 OJT hours as a QA Analyst at DXForm Technologies "
        f"executing regression and bug tracking across four multi-platform client applications, I bring a rigorous approach to software reliability, "
        f"aligning directly with {job.company}'s requirements for {skills_str}."
    )
    
    body_2 = (
        f"In addition to cloud and reliability engineering, I actively pioneer research-backed software solutions. "
        f"I authored 'Fusion Rush: Enhancing Proficiency in Boolean Logic Algebra through Gamification', accepted at the Scopus-indexed ICETT 2026 conference, "
        f"and developed a Visual AI Logic Proof Parser presented at the Philippine Computing Science Congress (PCSC 2026). "
        f"Holding certified credentials including PhilNITS Fundamental Engineer (FE), TOPCIT Level 3, and AWS Academy Graduate, "
        f"I thrive in autonomous, remote environments that require proactive problem-solving and clean engineering practices."
    )
    
    closing = (
        f"I am genuinely inspired by {job.company}'s mission and would welcome the opportunity to discuss how my technical versatility, "
        f"systematic rigor, and passion for excellence can contribute to your engineering milestones. Thank you for your consideration."
    )
    
    with open('engine/templates/cover_letter.tex', 'r', encoding='utf-8') as f:
        template = f.read()
        
    filled = template.replace('<<NAME>>', escape_latex(p['name']))
    filled = filled.replace('<<LOCATION>>', escape_latex(p['location']))
    filled = filled.replace('<<PHONE>>', escape_latex(p['phone']))
    filled = filled.replace('<<EMAIL>>', escape_latex(p['email']))
    filled = filled.replace('<<LINKEDIN>>', escape_latex(p['linkedin']))
    filled = filled.replace('<<PORTFOLIO>>', escape_latex(p['portfolio']))
    filled = filled.replace('<<COMPANY>>', escape_latex(job.company))
    filled = filled.replace('<<ROLE>>', escape_latex(job.role))
    filled = filled.replace('<<HIRING_CONTACT>>', escape_latex(contact))
    filled = filled.replace('<<HEADLINE>>', escape_latex(p['headline']))
    filled = filled.replace('<<OPENING_PARAGRAPH>>', escape_latex(opening))
    filled = filled.replace('<<BODY_PARAGRAPH_1>>', escape_latex(body_1))
    filled = filled.replace('<<BODY_PARAGRAPH_2>>', escape_latex(body_2))
    filled = filled.replace('<<CLOSING_PARAGRAPH>>', escape_latex(closing))
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(filled)

def compile_ats_resume_pdf(job: JobPosting, match: MatchResult, candidate: Dict[str, Any], pdf_path: str):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=10 * mm,
        rightMargin=10 * mm,
        topMargin=10 * mm,
        bottomMargin=10 * mm
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('Title', parent=styles['Normal'], fontName=FONT_SERIF_BOLD, fontSize=20, leading=22, alignment=1, textColor=colors.black)
    contact_style = ParagraphStyle('Contact', parent=styles['Normal'], fontName=FONT_SERIF, fontSize=10, leading=13, alignment=1, textColor=colors.HexColor('#111827'))
    link_style = ParagraphStyle('LinkLine', parent=styles['Normal'], fontName=FONT_SERIF, fontSize=10, leading=13, alignment=1, textColor=colors.HexColor('#1155CC'))
    section_style = ParagraphStyle('Section', parent=styles['Normal'], fontName=FONT_SERIF_BOLD, fontSize=11, leading=14, spaceBefore=7, spaceAfter=2, textColor=colors.black)
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontName=FONT_SERIF, fontSize=9.5, leading=12, textColor=colors.black)
    bold_body = ParagraphStyle('BoldBody', parent=styles['Normal'], fontName=FONT_SERIF_BOLD, fontSize=10, leading=13, textColor=colors.black)
    italic_body = ParagraphStyle('ItalicBody', parent=styles['Normal'], fontName=FONT_SERIF_ITALIC, fontSize=9.5, leading=12, textColor=colors.HexColor('#222222'))
    bullet_style = ParagraphStyle('Bullet', parent=styles['Normal'], fontName=FONT_SERIF, fontSize=9.5, leading=12, leftIndent=12, bulletIndent=2, textColor=colors.black)
    
    elements = []
    p = candidate['personal']
    
    # Header
    elements.append(Paragraph(p['name'], title_style))
    elements.append(Spacer(1, 2))
    contact_line = f"{p['email']} &nbsp;|&nbsp; {p['phone']} &nbsp;|&nbsp; {p.get('location', 'Cebu City, PH')}"
    elements.append(Paragraph(contact_line, contact_style))
    elements.append(Spacer(1, 1))
    
    portfolio_clean = p.get('portfolio', 'roddneilgemina.github.io').replace('https://', '')
    github_clean = p.get('github', 'github.com/RoddneilGemina').replace('https://', '')
    linkedin_clean = p.get('linkedin', 'linkedin.com/in/roddneil-gemina-20b423409').replace('https://www.', '').replace('https://', '')
    links_line = f"<a href='{p.get('portfolio', '#')}'><u>{portfolio_clean}</u></a> &nbsp;|&nbsp; <a href='{p.get('github', '#')}'><u>{github_clean}</u></a> &nbsp;|&nbsp; <a href='{p.get('linkedin', '#')}'><u>{linkedin_clean}</u></a>"
    elements.append(Paragraph(links_line, link_style))
    elements.append(Spacer(1, 4))
    
    # 1. Experience
    elements.append(Paragraph("PROFESSIONAL EXPERIENCE", section_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceBefore=1, spaceAfter=4))
    for exp in candidate.get('experience', []):
        elements.append(Paragraph(f"<b>{exp['company']} – {exp['role']}</b> | {exp.get('location', 'Cebu City, PH')}", bold_body))
        elements.append(Paragraph(f"<i>{exp['period']}</i>", italic_body))
        for b in exp.get('bullets', []):
            elements.append(Paragraph(f"■ {b}", bullet_style))
        elements.append(Spacer(1, 3))
        
    # 2. Projects
    elements.append(Paragraph("RELEVANT PROJECTS", section_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceBefore=1, spaceAfter=4))
    for proj in candidate.get('projects', []):
        tech = ', '.join(proj.get('tech', []))
        role = proj.get('role', 'Developer')
        elements.append(Paragraph(f"<b>{proj['name']} – {role}</b> | <i>{tech}</i>", bold_body))
        for b in proj.get('bullets', []):
            elements.append(Paragraph(f"■ {b}", bullet_style))
        elements.append(Spacer(1, 3))
        
    # 3. Technical Skills
    elements.append(Paragraph("TECHNICAL SKILLS", section_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceBefore=1, spaceAfter=4))
    skills_dict = candidate.get('skills', {})
    for cat_name, skill_list in skills_dict.items():
        title = cat_name.replace('_', ' ').title()
        elements.append(Paragraph(f"<b>{title}:</b> {', '.join(skill_list)}", body_style))
    elements.append(Spacer(1, 3))

    # 4. Education
    elements.append(Paragraph("EDUCATION", section_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceBefore=1, spaceAfter=4))
    for edu in candidate.get('education', []):
        edu_table = Table([[Paragraph(f"<b>{edu['institution']}</b> – {edu['degree']}", bold_body), Paragraph(f"<b>{edu['period']}</b>", ParagraphStyle('RAlign', parent=bold_body, alignment=2))]], colWidths=[400, 150])
        edu_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 1)]))
        elements.append(edu_table)
    elements.append(Spacer(1, 3))
    
    # 5. Research & Competitions
    if candidate.get('research'):
        elements.append(Paragraph("RESEARCH CONFERENCES & COMPETITIONS", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceBefore=1, spaceAfter=4))
        for res in candidate.get('research', []):
            loc_str = f" | {res['location']}" if res.get('location') else ""
            elements.append(Paragraph(f"<b>{res['title']}</b>{loc_str}", bold_body))
            elements.append(Paragraph(f"{res.get('description', '')}", body_style))
            elements.append(Spacer(1, 2))
        elements.append(Spacer(1, 2))

    # 6. Certifications
    if candidate.get('certifications'):
        elements.append(Paragraph("CERTIFICATIONS", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceBefore=1, spaceAfter=4))
        for cert in candidate.get('certifications', []):
            c_table = Table([[Paragraph(cert['title'], body_style), Paragraph(cert.get('date', ''), ParagraphStyle('RAlign', parent=body_style, alignment=2))]], colWidths=[420, 130])
            c_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 1)]))
            elements.append(c_table)
        elements.append(Spacer(1, 3))

    # 7. Volunteering
    if candidate.get('volunteering'):
        elements.append(Paragraph("VOLUNTEERING AND LEADERSHIP EXPERIENCE", section_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceBefore=1, spaceAfter=4))
        for vol in candidate.get('volunteering', []):
            v_table = Table([[Paragraph(f"<b>{vol['organization']}</b>", bold_body), Paragraph(vol.get('period', ''), ParagraphStyle('RAlign', parent=body_style, alignment=2))]], colWidths=[420, 130])
            v_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 1)]))
            elements.append(v_table)
            for b in vol.get('bullets', []):
                elements.append(Paragraph(f"■ {b}", bullet_style))
            elements.append(Spacer(1, 2))
        
    doc.build(elements)

def compile_ats_cover_letter_pdf(job: JobPosting, match: MatchResult, candidate: Dict[str, Any], pdf_path: str):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.6 * inch,
        bottomMargin=0.6 * inch
    )
    styles = getSampleStyleSheet()
    
    name_style = ParagraphStyle('Name', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=16, leading=18, textColor=colors.HexColor('#111827'))
    header_style = ParagraphStyle('HeadContact', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=colors.HexColor('#4B5563'))
    body_style = ParagraphStyle('LetterBody', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=14, spaceAfter=10, textColor=colors.HexColor('#1F2937'))
    bold_sub = ParagraphStyle('BoldSub', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=14, spaceAfter=8, textColor=colors.HexColor('#111827'))
    
    elements = []
    p = candidate['personal']
    contact = job.hiring_contact if job.hiring_contact and job.hiring_contact != 'Hiring Manager' else f"{job.company} Hiring Team"
    
    # Header
    elements.append(Paragraph(p['name'], name_style))
    elements.append(Spacer(1, 2))
    elements.append(Paragraph(f"{p.get('location', 'Cebu City, PH')} | {p['phone']} | {p['email']}", header_style))
    elements.append(Paragraph(f"LinkedIn: {p['linkedin']} | Portfolio: {p['portfolio']}", header_style))
    elements.append(Spacer(1, 4))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=4, spaceAfter=12))
    
    # Recipient
    elements.append(Paragraph(f"<b>To:</b> {contact}<br/><b>Company:</b> {job.company}<br/><b>Position:</b> {job.role} (Remote / Philippines)", body_style))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"<b>Subject: Application for {job.role}</b>", bold_sub))
    
    # Salutation
    elements.append(Paragraph(f"Dear {contact},", body_style))
    
    opening = (
        f"I am writing to express my enthusiastic interest in the {job.role} position at {job.company}. "
        f"With a solid Computer Science degree from Cebu Institute of Technology - University, practical industry experience "
        f"in Site Reliability Engineering at Opswerks and Software QA at DXForm Technologies, and Scopus-indexed research recognition in intelligent systems, "
        f"I am confident in my readiness to make an immediate, positive impact on your remote engineering team."
    )
    elements.append(Paragraph(opening, body_style))
    
    skills_str = ', '.join(match.matched_skills[:4]) if match.matched_skills else 'Python, AWS, containerization, and modern web architectures'
    body_1 = (
        f"Throughout my work, I prioritize reliability, clean architecture, and performance. "
        f"During my SRE internship at Opswerks, I administered Linux environments, configured Kubernetes pods and Docker containers, "
        f"and automated operations across AWS infrastructure. Furthermore, having completed 250 OJT hours as a QA Analyst at DXForm Technologies "
        f"validating four client web and mobile applications, I bring a systematic test-driven mindset that aligns directly with {job.company}'s requirements for {skills_str}."
    )
    elements.append(Paragraph(body_1, body_style))
    
    body_2 = (
        f"In addition to cloud infrastructure and reliability engineering, I actively innovate in software development. "
        f"I authored 'Fusion Rush: Enhancing Proficiency in Boolean Logic Algebra through Gamification', accepted at the Scopus-indexed ICETT 2026 conference, "
        f"and developed a Visual AI Logic Proof Parser presented at the Philippine Computing Science Congress (PCSC 2026). "
        f"Holding credentials including PhilNITS Fundamental Engineer (FE), TOPCIT Level 3, and AWS Academy Graduate, "
        f"I am well-equipped for proactive, autonomous remote execution."
    )
    elements.append(Paragraph(body_2, body_style))
    
    closing = (
        f"I would welcome the opportunity to discuss how my technical versatile background, reliability mindset, and passion for excellence "
        f"can support {job.company}'s engineering initiatives. Thank you for your time and consideration."
    )
    elements.append(Paragraph(closing, body_style))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph("Sincerely,", body_style))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(f"<b>{p['name']}</b><br/>{p['headline']}", body_style))
    
    doc.build(elements)

def build_documents(job: JobPosting, match: MatchResult, candidate: Dict[str, Any], job_output_dir: str):
    os.makedirs(job_output_dir, exist_ok=True)
    
    resume_tex_path = os.path.join(job_output_dir, "resume.tex")
    resume_pdf_path = os.path.join(job_output_dir, "resume.pdf")
    cover_letter_tex_path = os.path.join(job_output_dir, "cover_letter.tex")
    cover_letter_pdf_path = os.path.join(job_output_dir, "cover_letter.pdf")
    
    # 1. Generate LaTeX source files
    render_resume_tex(job, match, candidate, resume_tex_path)
    render_cover_letter_tex(job, match, candidate, cover_letter_tex_path)
    
    # 2. Compile ATS-grade PDFs
    compile_ats_resume_pdf(job, match, candidate, resume_pdf_path)
    compile_ats_cover_letter_pdf(job, match, candidate, cover_letter_pdf_path)
    
    return resume_tex_path, resume_pdf_path, cover_letter_tex_path, cover_letter_pdf_path
