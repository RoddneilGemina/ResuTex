import { ResumeData, CoverLetterData } from "@/types/resume";

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

export function generateResumeLatex(resume: ResumeData): string {
  const p = resume.personal;

  // Experience section
  const expLines: string[] = [];
  (resume.experience || []).forEach((exp) => {
    expLines.push(
      `\\textbf{${escapeLatex(exp.company)} -- ${escapeLatex(exp.role)}} | ${escapeLatex(exp.location || "")}\\\\`
    );
    expLines.push(`\\textit{${escapeLatex(exp.period)}}`);
    expLines.push(`\\begin{itemize}`);
    (exp.bullets || []).forEach((b) => {
      expLines.push(`  \\item ${escapeLatex(b)}`);
    });
    expLines.push(`\\end{itemize}`);
    expLines.push(`\\vspace{4pt}`);
  });
  const experienceSection = expLines.join("\n");

  // Projects section
  const projLines: string[] = [];
  (resume.projects || []).forEach((proj) => {
    const techStr = (proj.tech || []).join(", ");
    const roleStr = proj.role || "Developer";
    projLines.push(
      `\\textbf{${escapeLatex(proj.name)} -- ${escapeLatex(roleStr)}} | \\textit{${escapeLatex(techStr)}}`
    );
    projLines.push(`\\begin{itemize}`);
    (proj.bullets || []).forEach((b) => {
      projLines.push(`  \\item ${escapeLatex(b)}`);
    });
    projLines.push(`\\end{itemize}`);
    projLines.push(`\\vspace{4pt}`);
  });
  const projectsSection = projLines.join("\n");

  // Skills section
  const skillsDict = resume.skills || {};
  const skillRows: string[] = [];
  Object.entries(skillsDict).forEach(([catKey, skillList]) => {
    const catTitle = catKey
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    skillRows.push(
      `\\textbf{${escapeLatex(catTitle)}:} ${escapeLatex((skillList || []).join(", "))} \\\\`
    );
  });
  const skillsSection = skillRows.join("\n");

  // Education section
  const eduLines: string[] = [];
  (resume.education || []).forEach((edu) => {
    eduLines.push(
      `\\textbf{${escapeLatex(edu.institution)}} -- ${escapeLatex(edu.degree)} \\hfill ${escapeLatex(edu.period)} \\\\`
    );
  });
  const educationSection = eduLines.join("\n");

  // Research section
  const researchLines: string[] = [];
  if (resume.research && resume.research.length > 0) {
    resume.research.forEach((res) => {
      let titleFull = res.title;
      if (res.location) {
        titleFull += ` | ${res.location}`;
      }
      researchLines.push(`\\textbf{${escapeLatex(titleFull)}} \\\\`);
      researchLines.push(
        `${escapeLatex(res.description || "")} \\\\ \\vspace{3pt}`
      );
    });
  }
  const researchSection = researchLines.join("\n");

  // Certifications section
  const certLines: string[] = [];
  (resume.certifications || []).forEach((cert) => {
    certLines.push(
      `${escapeLatex(cert.title)} \\hfill \\textbf{${escapeLatex(cert.date)}} \\\\`
    );
  });
  const certificationsSection = certLines.join("\n");

  // Volunteering section
  const volLines: string[] = [];
  if (resume.volunteering && resume.volunteering.length > 0) {
    resume.volunteering.forEach((vol) => {
      volLines.push(
        `\\textbf{${escapeLatex(vol.organization)}} \\hfill ${escapeLatex(vol.period)}\\\\`
      );
      if (vol.bullets && vol.bullets.length > 0) {
        volLines.push(`\\begin{itemize}`);
        vol.bullets.forEach((b) => {
          volLines.push(`  \\item ${escapeLatex(b)}`);
        });
        volLines.push(`\\end{itemize}`);
      }
      volLines.push(`\\vspace{3pt}`);
    });
  }
  const volunteeringSection = volLines.join("\n");

  const portfolioUrl = p.portfolio || "https://roddneilgemina.github.io";
  const githubUrl = p.github || "https://github.com/RoddneilGemina";
  const linkedinUrl =
    p.linkedin || "https://www.linkedin.com/in/roddneil-gemina-20b423409";

  const portfolioLabel = portfolioUrl.replace(/^https?:\/\//, "");
  const githubLabel = githubUrl.replace(/^https?:\/\//, "");
  const linkedinLabel = linkedinUrl
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/^linkedin\.com\/in\//, "in/");

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
    pdftitle={${escapeLatex(p.name)} - Curriculum Vitae},
    pdfauthor={${escapeLatex(p.name)}}
}

% Section formatting matching standard CV template
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{9pt}{4pt}

\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=14pt,noitemsep,topsep=2pt,label={\\tiny$\\blacksquare$}}

\\begin{document}

% Header
\\begin{center}
    {\\LARGE \\textbf{${escapeLatex(p.name)}}} \\\\ \\vspace{2pt}
    \\small ${escapeLatex(p.email)} \\ $\\cdot$ \\ ${escapeLatex(p.phone)} \\ $\\cdot$ \\ ${escapeLatex(p.location || "Cebu City, PH")} \\\\ \\vspace{2pt}
    \\small \\href{${escapeLatex(portfolioUrl)}}{${escapeLatex(portfolioLabel)}} \\ $\\cdot$ \\ \\href{${escapeLatex(githubUrl)}}{${escapeLatex(githubLabel)}} \\ $\\cdot$ \\ \\href{${escapeLatex(linkedinUrl)}}{${escapeLatex(linkedinLabel)}}
\\end{center}

\\vspace{-2pt}

\\section{Professional Experience}
${experienceSection}

\\section{Relevant Projects}
${projectsSection}

\\section{Technical Skills}
${skillsSection}

\\section{Education}
${educationSection}
${
  researchLines.length > 0
    ? `\n\\section{Research Conferences \\& Competitions}\n${researchSection}\n`
    : ""
}
\\section{Certifications}
${certificationsSection}
${
  volLines.length > 0
    ? `\n\\section{Volunteering and Leadership Experience}\n${volunteeringSection}\n`
    : ""
}
\\end{document}
`;
}

export function generateCoverLetterLatex(
  resume: ResumeData,
  letter: CoverLetterData
): string {
  const p = resume.personal;
  const hiringContact =
    letter.hiringContact && letter.hiringContact !== "Hiring Manager"
      ? letter.hiringContact
      : `${letter.company} Hiring Team`;

  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{letterpaper, margin=0.8in}
\\usepackage{hyperref}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue,
    pdftitle={${escapeLatex(p.name)} - Cover Letter},
    pdfauthor={${escapeLatex(p.name)}}
}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{8pt}

\\begin{document}

\\textbf{${escapeLatex(p.name)}} \\\\
${escapeLatex(p.location || "Cebu City, PH")} \\\\
${escapeLatex(p.phone)} \\ $\\cdot$ \\ \\href{mailto:${escapeLatex(p.email)}}{${escapeLatex(p.email)}} \\\\
\\href{${escapeLatex(p.linkedin || "")}}{${escapeLatex(p.linkedin || "")}} \\ $\\cdot$ \\ \\href{${escapeLatex(p.portfolio || "")}}{${escapeLatex(p.portfolio || "")}}

\\vspace{12pt}
\\today

\\vspace{8pt}
\\textbf{Hiring Team / ${escapeLatex(hiringContact)}} \\\\
${escapeLatex(letter.company)} \\\\
Remote (Eligible for Philippines)

\\vspace{8pt}
\\textbf{Subject: Application for ${escapeLatex(letter.role)}}

\\vspace{4pt}
Dear ${escapeLatex(hiringContact)},

${escapeLatex(letter.openingParagraph)}

${escapeLatex(letter.bodyParagraph1)}

${escapeLatex(letter.bodyParagraph2)}

${escapeLatex(letter.closingParagraph)}

Sincerely,

\\vspace{12pt}
\\textbf{${escapeLatex(p.name)}} \\\\
${escapeLatex(p.headline || "Software Engineer")}
\\end{document}
`;
}
