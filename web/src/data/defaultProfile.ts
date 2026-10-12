import { ResumeData } from "@/types/resume";

export const defaultResumeData: ResumeData = {
  personal: {
    name: "Roddneil B. Gemina",
    email: "roddneilgemina@gmail.com",
    phone: "+63 956-241-3577",
    location: "Cebu City, PH",
    headline: "Full-Stack Software Engineer & Site Reliability Engineer",
    portfolio: "https://roddneilgemina.github.io",
    github: "https://github.com/RoddneilGemina",
    linkedin: "https://www.linkedin.com/in/roddneil-gemina-20b423409",
    summary:
      "Full-stack software engineer and site reliability engineering intern with published research in AI and gamified systems, hands-on experience at Opswerks and DXForm Technologies (leading QA, UI/UX, and application logic across Gigi POS and Aicquire), and certified credentials including PhilNITS FE, TOPCIT Level 3, and AWS Academy Graduate. Skilled in TypeScript, React, Next.js, React Native, Node.js, Python, Java, AWS, Kubernetes, Docker, PostgreSQL, MongoDB, and Stripe integration."
  },
  education: [
    {
      institution: "Cebu Institute of Technology - University",
      degree: "BS Computer Science",
      location: "Cebu City, PH",
      period: "2022 – 2026",
      highlights: [
        "Presidential OIC & Bass 2 - Koro Teknoy Chorale",
        "Primary Author - Scopus-Indexed ICETT 2026 Conference Paper",
        "Presenter - Philippine Computing Science Congress (PCSC 2026, Davao)"
      ]
    },
    {
      institution: "Philippine Science High School - Central Visayas Campus",
      degree: "STEM Strand (With Honors)",
      location: "Argao, Cebu, PH",
      period: "2016 – 2022",
      highlights: [
        "Graduated With Honors",
        "Dean's Lister Academic Placement",
        "Red Hot Pawns Chess Club Strategist"
      ]
    }
  ],
  experience: [
    {
      company: "Opswerks",
      role: "Site Reliability Engineering (SRE) Intern",
      location: "Cebu City, PH",
      period: "January 2026 – Present",
      bullets: [
        "Administered enterprise Linux server environments, configuring AWS cloud infrastructure, containerized microservices via Docker, and production-grade Kubernetes pod orchestration.",
        "Constructed automated deployment pipelines and integrated cluster telemetry, distributed logging, and health monitoring tools to sustain high platform reliability and zero-downtime operations.",
        "Automated repetitive operational runbooks and system provisioning using Python and Bash scripting, significantly reducing manual incident mitigation time and operational toil."
      ],
      keywords: ["AWS", "Kubernetes", "Docker", "Linux", "SRE", "Python", "Bash", "CI/CD", "Telemetry", "DevOps"]
    },
    {
      company: "DXForm Technologies",
      role: "Quality Assurance Analyst & Software Engineer",
      location: "Cebu City, PH",
      period: "January 2025 – August 2025",
      bullets: [
        "Gigi POS (Next.js, React Native, PostgreSQL, Stripe): Directed core QA testing strategies, authoring structured test matrices and regression suites across web and mobile POS terminals; contributed directly to UI/UX design, application logic, and product experience while developing code-level bug fixes and ensuring transactional integrity for Stripe payment processing.",
        "Aicquire (React, Node.js, MongoDB, AI-Assisted Tooling): Spearheaded frontend UI/UX architecture and responsive components in React, engineered backend application logic and MongoDB data pipelines in Node.js, and refined product experience to streamline AI-assisted tooling interactions.",
        "Logged reproducible defect lifecycles with root-cause analysis in Jira, collaborated cross-functionally with dev leads to optimize REST API response payloads, and enforced cross-platform UX fidelity."
      ],
      keywords: ["QA", "Gigi POS", "Aicquire", "Next.js", "React Native", "PostgreSQL", "Stripe", "React", "Node.js", "MongoDB", "AI Tooling", "Jira", "Full-Stack"]
    },
    {
      company: "Nexchef",
      role: "Mobile Architect & Full-Stack Developer (Contract / Freelance)",
      location: "Cebu City, PH",
      period: "November 2024 – March 2025",
      bullets: [
        "Developed a full-stack culinary mobile application in React Native and TypeScript featuring modular recipe creation, live step-by-step guidance, and synchronized multi-stage culinary timer engines.",
        "Integrated Supabase Realtime and WebSockets for instant state synchronization across multiple client devices, backed by PostgreSQL relational persistence.",
        "Designed responsive multi-screen layouts with micro-interactions, local offline persistence, and low-latency client-side caching."
      ],
      keywords: ["React Native", "TypeScript", "Supabase", "WebSockets", "PostgreSQL", "Mobile-First"]
    },
    {
      company: "Refertoire",
      role: "Systems Architect & Full-Stack Developer (Contract / Freelance)",
      location: "Cebu City, PH",
      period: "January 2026 – Present",
      bullets: [
        "Architected a 100% offline-capable music repertoire management platform, allowing performing ensembles to organize, search, and view complete digital sheet music libraries without internet dependency.",
        "Engineered local offline persistence utilizing IndexedDB and modern Service Workers, coupled with bidirectional client synchronization protocols upon network reconnection.",
        "Implemented responsive high-resolution document viewing and instant multi-parameter filtering across hundreds of musical scores."
      ],
      keywords: ["TypeScript", "React", "IndexedDB", "PWA", "Offline-First", "Service Workers"]
    },
    {
      company: "DishCover",
      role: "Full-Stack Developer & Database Architect (Contract / Freelance)",
      location: "Cebu City, PH",
      period: "May 2024 – October 2024",
      bullets: [
        "Developed a comprehensive pantry and household inventory management application featuring automated expiration tracking, replenishment alerts, and storage categorization.",
        "Engineered normalized PostgreSQL relational schemas optimized for high-volume item lookup, barcode data association, and historical consumption analytics.",
        "Built a responsive, minimalist UI with Tailwind CSS and Next.js server components, optimizing page loads and delivering sub-second interaction speed."
      ],
      keywords: ["Next.js", "React", "PostgreSQL", "Tailwind CSS", "Database Architecture"]
    }
  ],
  projects: [
    {
      name: "TakeIt",
      role: "Full-Stack Developer & Platform Architect",
      period: "2024",
      tech: ["React", "Node.js", "Express", "PostgreSQL", "REST APIs"],
      bullets: [
        "Architected an end-to-end event management and ticketing platform delivering fluid seat reservations, organizer administration consoles, and automated QR pass verification.",
        "Engineered transactional database locking mechanisms in PostgreSQL to eliminate duplicate ticket allocations and race conditions under concurrent booking traffic.",
        "Built responsive client interfaces with real-time seat inventory indicators, event scheduling workflows, and secure payment gateway integrations."
      ]
    },
    {
      name: "Bomberman BattleRoyale",
      role: "Client-Server Systems Architect & Game Developer",
      period: "2024",
      tech: ["Java", "Multi-Threading", "TCP/IP Sockets", "Swing", "OOP"],
      bullets: [
        "Engineered a 2D multiplayer client-server architecture utilizing custom TCP/IP socket protocols and binary serialization to synchronize multi-player state with minimal packet latency.",
        "Implemented strict Object-Oriented Programming (OOP) design patterns and concurrent multithreading models to decouple the continuous game loop and rendering engine from network I/O.",
        "Designed procedural arena destruction algorithms, deterministic grid collision detection, and authoritative server-side hit registration."
      ]
    },
    {
      name: "Fusion Rush",
      role: "Lead Developer & AI Systems Architect",
      period: "2025 – 2026",
      tech: ["Python", "JavaScript", "Discrete Math", "Gamification Engine"],
      bullets: [
        "Architected an educational AI tutoring and gamified logic application verifying Discrete Mathematics Rules of Inference in real-time.",
        "Built a rule-based AST inference validation engine in Python, delivering immediate pedagogical feedback and reducing student error rates on symbolic logic exercises."
      ]
    }
  ],
  research: [
    {
      title: "International Conference on Education and Training Technologies (ICETT 2026)",
      role: "Primary Author & Software Architect",
      location: "Scopus-Indexed",
      paper: "Fusion Rush: Enhancing Proficiency in Boolean Logic Algebra through Gamification",
      description:
        "Architected and authored 'Fusion Rush: Enhancing Proficiency in Boolean Logic Algebra through Gamification'. Engineered an adaptive AI tutoring software and gamified inference verification system, conducting empirical classroom deployments across Discrete Mathematics cohorts at CIT-U College of Computer Studies."
    },
    {
      title: "10th Philippine Computing Science Congress (PCSC 2026)",
      role: "Author & Presenter",
      location: "Davao",
      paper: "Bridging the Gap Between Synthetic and Real Handwriting: Using Visual AI to Accurately Parse Structured Logic Proofs",
      description:
        "Developed and presented 'Bridging the Gap Between Synthetic and Real Handwriting: Using Visual AI to Accurately Parse Structured Logic Proofs'. Engineered an end-to-end computer vision and structural parsing pipeline converting handwritten Discrete Math logic proofs into structured Abstract Syntax Trees (ASTs) for automated grading and semantic validity verification."
    }
  ],
  certifications: [
    {
      title: "PhilNITS Fundamental Information Technology Engineers (FE) Certification",
      issuer: "Philippine National IT Standards Foundation",
      date: "Apr. 2025"
    },
    {
      title: "Level 3 TOPCIT Passer (Test of Practical Competency in IT)",
      issuer: "Institute for Information & Communications Technology Planning & Evaluation",
      date: "Jun. 2025"
    },
    {
      title: "AWS Academy Graduate - Cloud Architecting",
      issuer: "Amazon Web Services (AWS)",
      date: "Nov. 2025"
    },
    {
      title: "AWS Academy Graduate - Cloud Foundations",
      issuer: "Amazon Web Services (AWS)",
      date: "Nov. 2025"
    }
  ],
  volunteering: [
    {
      organization: "Koro Teknoy Chorale – Presidential OIC & Bass 2",
      period: "Jun. 2022 – Present",
      bullets: [
        "Served as Presidential Officer-in-Charge directing choral operations, institutional representation, and rehearsal governance for the university’s premier choral ensemble.",
        "Coordinated stage logistics, member scheduling, and vocal performances for major academic ceremonies and institutional university assemblies."
      ]
    },
    {
      organization: "Concert for a Cause – Featured Choral Performer",
      period: "Jan. 2023",
      bullets: [
        "Volunteered as featured vocalist performing in the Bradford Grand Choir benefit concert, mobilizing fundraising and relief donations for families displaced by Typhoon Odette."
      ]
    }
  ],
  skills: {
    frontend_development: [
      "TypeScript",
      "JavaScript (ES6+)",
      "React.js",
      "Next.js",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Responsive Web Design",
      "UI/UX Design (Figma)",
      "PWA"
    ],
    backend_api_engineering: [
      "Node.js",
      "Express.js",
      "Python (FastAPI, Django)",
      "Java",
      "C#",
      "C++",
      "RESTful APIs",
      "WebSockets",
      "TCP/IP Sockets",
      "Multi-threading"
    ],
    databases_state_management: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Supabase",
      "SQLite",
      "Redis",
      "Relational Modeling",
      "Query Optimization"
    ],
    cloud_devops_sre: [
      "AWS (EC2, S3, VPC, IAM, RDS)",
      "Docker & Containers",
      "Kubernetes",
      "Linux Server Administration",
      "CI/CD Pipelines",
      "Git",
      "GitHub",
      "Bash Scripting"
    ],
    mobile_payment_platforms: [
      "React Native",
      "Android Studio (Java/Kotlin)",
      "Stripe API Integration"
    ],
    ai_engineering_applied_tools: [
      "AI-Assisted Tooling",
      "Computer Vision",
      "OCR Pipelines",
      "Rule-Based Inference Engines",
      "AST Parsing"
    ]
  }
};
