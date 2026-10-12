import { ResumeData, CoverLetterData, emptyResumeData } from "@/types/resume";

export function escapeLatex(text: string | undefined | null): string {
  if (!text) return "";
  const replacements: Record<string, string> = {
    "\\": "\\textbackslash{}",
    "&": "\\&",
    "%": "\\%",
    "$": "\\$",
    "#": "\\#",
    "_": "\\_",
    "{": "\\{",
    "}": "\\}",
    "~": "\\textasciitilde{}",
    "^": "\\textasciicircum{}",
  };

  let escaped = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (replacements[char]) {
      escaped += replacements[char];
    } else {
      escaped += char;
    }
  }
  return escaped;
}

export function generateResumeLatex(resume: ResumeData | null | undefined): string {
  if (!resume) return "";
  const p = resume.personal || emptyResumeData.personal;

  // Experience section
  const expLines: string[] = [];
  (resume.experience || []).forEach((exp) => {
    if (!exp.company && !exp.role && (!exp.bullets || exp.bullets.length === 0)) return;
    expLines.push(
      `\\textbf{${escapeLatex(exp.company)} -- ${escapeLatex(exp.role)}} | ${escapeLatex(exp.location || "")}\\\\`
    );
    if (exp.period) {
      expLines.push(`\\textit{${escapeLatex(exp.period)}}`);
    }
    if (exp.bullets && exp.bullets.length > 0) {
      expLines.push(`\\begin{itemize}`);
      exp.bullets.forEach((b) => {
        if (b.trim()) {
          expLines.push(`  \\item ${escapeLatex(b)}`);
        }
      });
      expLines.push(`\\end{itemize}`);
    }
    expLines.push(`\\vspace{4pt}`);
  });
  const experienceSection = expLines.join("\n");

  // Projects section
  const projLines: string[] = [];
  (resume.projects || []).forEach((proj) => {
    if (!proj.name && (!proj.bullets || proj.bullets.length === 0)) return;
    const techStr = (proj.tech || []).join(", ");
    const roleStr = proj.role || "Developer";
    projLines.push(
      `\\textbf{${escapeLatex(proj.name)} -- ${escapeLatex(roleStr)}} | \\textit{${escapeLatex(techStr)}}`
    );
    if (proj.bullets && proj.bullets.length > 0) {
      projLines.push(`\\begin{itemize}`);
      proj.bullets.forEach((b) => {
        if (b.trim()) {
          projLines.push(`  \\item ${escapeLatex(b)}`);
        }
      });
      projLines.push(`\\end{itemize}`);
    }
    projLines.push(`\\vspace{4pt}`);
  });
  const projectsSection = projLines.join("\n");

  // Skills section
  const skillsDict = resume.skills || {};
  const skillRows: string[] = [];
  Object.entries(skillsDict).forEach(([catKey, skillList]) => {
    if (!skillList || skillList.length === 0) return;
    const catTitle = catKey
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    skillRows.push(
      `\\textbf{${escapeLatex(catTitle)}:} ${escapeLatex(skillList.join(", "))} \\\\`
    );
  });
  const skillsSection = skillRows.join("\n");

  // Education section
  const eduLines: string[] = [];
  (resume.education || []).forEach((edu) => {
    if (!edu.institution && !edu.degree) return;
    eduLines.push(
      `\\textbf{${escapeLatex(edu.institution)}} -- ${escapeLatex(edu.degree)} \\hfill ${escapeLatex(edu.period)} \\\\`
    );
  });
  const educationSection = eduLines.join("\n");

  // Research section
  const researchLines: string[] = [];
  if (resume.research && resume.research.length > 0) {
    resume.research.forEach((res) => {
      if (!res.title && !res.description) return;
      let titleFull = res.title;
      if (res.location) {
        titleFull += ` | ${res.location}`;
      }
      researchLines.push(`\\textbf{${escapeLatex(titleFull)}} \\\\`);
      if (res.description) {
        researchLines.push(
          `${escapeLatex(res.description)} \\\\ \\vspace{3pt}`
        );
      }
    });
  }
  const researchSection = researchLines.join("\n");

  // Certifications section
  const certLines: string[] = [];
  (resume.certifications || []).forEach((cert) => {
    if (!cert.title) return;
    certLines.push(
      `${escapeLatex(cert.title)} \\hfill \\textbf{${escapeLatex(cert.date)}} \\\\`
    );
  });
  const certificationsSection = certLines.join("\n");

  // Volunteering section
  const volLines: string[] = [];
  if (resume.volunteering && resume.volunteering.length > 0) {
    resume.volunteering.forEach((vol) => {
      if (!vol.organization) return;
      volLines.push(
        `\\textbf{${escapeLatex(vol.organization)}} \\hfill ${escapeLatex(vol.period)}\\\\`
      );
      if (vol.bullets && vol.bullets.length > 0) {
        volLines.push(`\\begin{itemize}`);
        vol.bullets.forEach((b) => {
          if (b.trim()) {
            volLines.push(`  \\item ${escapeLatex(b)}`);
          }
        });
        volLines.push(`\\end{itemize}`);
      }
      volLines.push(`\\vspace{3pt}`);
    });
  }
  const volunteeringSection = volLines.join("\n");

  const portfolioUrl = p.portfolio || "";
  const githubUrl = p.github || "";
  const linkedinUrl = p.linkedin || "";

  const contactParts: string[] = [];
  if (p.email) contactParts.push(escapeLatex(p.email));
  if (p.phone) contactParts.push(escapeLatex(p.phone));
  if (p.location) contactParts.push(escapeLatex(p.location));

  const linkParts: string[] = [];
  if (portfolioUrl) {
    const label = portfolioUrl.replace(/^https?:\/\//, "");
    linkParts.push(`\\href{${escapeLatex(portfolioUrl)}}{${escapeLatex(label)}}`);
  }
  if (githubUrl) {
    const label = githubUrl.replace(/^https?:\/\//, "");
    linkParts.push(`\\href{${escapeLatex(githubUrl)}}{${escapeLatex(label)}}`);
  }
  if (linkedinUrl) {
    const label = linkedinUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/^linkedin\.com\/in\//, "in/");
    linkParts.push(`\\href{${escapeLatex(linkedinUrl)}}{${escapeLatex(label)}}`);
  }

  return `\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=0.4in}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{amssymb}
\\usepackage{xcolor}

\\definecolor{linkblue}{HTML}{1155CC}

\\hypersetup{
    colorlinks=true,
    linkcolor=linkblue,
    urlcolor=linkblue,
    pdftitle={${escapeLatex(p.name || "Resume")} - Curriculum Vitae},
    pdfauthor={${escapeLatex(p.name || "Candidate")}}
}

% Section formatting matching standard CV template
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{9pt}{4pt}

\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=14pt,noitemsep,topsep=2pt,label={\\tiny$\\blacksquare$}}

\\begin{document}

% Header
\\begin{center}
    {\\LARGE \\textbf{${escapeLatex(p.name || "Candidate Name")}}} \\\\ \\vspace{2pt}
    ${contactParts.length > 0 ? `\\small ${contactParts.join(" \\ $\\cdot$ \\ ")} \\\\ \\vspace{2pt}` : ""}
    ${linkParts.length > 0 ? `\\small ${linkParts.join(" \\ $\\cdot$ \\ ")}` : ""}
\\end{center}

\\vspace{-2pt}

${expLines.length > 0 ? `\\section{Professional Experience}\n${experienceSection}\n` : ""}
${projLines.length > 0 ? `\\section{Relevant Projects}\n${projectsSection}\n` : ""}
${skillRows.length > 0 ? `\\section{Technical Skills}\n${skillsSection}\n` : ""}
${eduLines.length > 0 ? `\\section{Education}\n${educationSection}\n` : ""}
${researchLines.length > 0 ? `\\section{Research Conferences \\& Competitions}\n${researchSection}\n` : ""}
${certLines.length > 0 ? `\\section{Certifications}\n${certificationsSection}\n` : ""}
${volLines.length > 0 ? `\\section{Volunteering and Leadership Experience}\n${volunteeringSection}\n` : ""}
\\end{document}
`;
}

export function generateCoverLetterLatex(
  resume: ResumeData | null | undefined,
  letter: CoverLetterData
): string {
  const p = resume?.personal || emptyResumeData.personal;
  const hiringContact =
    letter.hiringContact && letter.hiringContact !== "Hiring Manager"
      ? letter.hiringContact
      : `${letter.company || "Target Company"} Hiring Team`;

  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{letterpaper, margin=0.8in}
\\usepackage{hyperref}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue,
    pdftitle={${escapeLatex(p.name || "Candidate")} - Cover Letter},
    pdfauthor={${escapeLatex(p.name || "Candidate")}}
}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{8pt}

\\begin{document}

\\textbf{${escapeLatex(p.name || "Candidate Name")}} \\\\
${escapeLatex(p.location || "")} \\\\
${escapeLatex(p.phone)} \\ $\\cdot$ \\ \\href{mailto:${escapeLatex(p.email)}}{${escapeLatex(p.email)}} \\\\
\\href{${escapeLatex(p.linkedin || "")}}{${escapeLatex(p.linkedin || "")}} \\ $\\cdot$ \\ \\href{${escapeLatex(p.portfolio || "")}}{${escapeLatex(p.portfolio || "")}}

\\vspace{12pt}
\\today

\\vspace{8pt}
\\textbf{Hiring Team / ${escapeLatex(hiringContact)}} \\\\
${escapeLatex(letter.company || "Company")} \\\\
Remote (Eligible for Philippines)

\\vspace{8pt}
\\textbf{Subject: Application for ${escapeLatex(letter.role || "Software Engineer")}}

\\vspace{4pt}
Dear ${escapeLatex(hiringContact)},

${escapeLatex(letter.openingParagraph)}

${escapeLatex(letter.bodyParagraph1)}

${escapeLatex(letter.bodyParagraph2)}

${escapeLatex(letter.closingParagraph)}

Sincerely,

\\vspace{12pt}
\\textbf{${escapeLatex(p.name || "Candidate Name")}} \\\\
${escapeLatex(p.headline || "Software Engineer")}
\\end{document}
`;
}
