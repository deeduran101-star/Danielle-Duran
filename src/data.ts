export interface Artifact {
  id: string;
  title: string;
  category: "Theory" | "Methods" | "Advanced Studies" | "Thematic Areas";
  summary: string;
  icon: string;
  content: string;
  skills: string[];
  pdfUrl?: string;
}

export const artifacts: Artifact[] = [
  {
    id: "theory-artifact",
    title: "You’re Majoring in Sociology? Oh, So You Study…Social Media/Gatherings?",
    category: "Theory",
    summary: "Course/Context: SOC 96A – Essay 2",
    icon: "BookOpen",
    content: "### Annotation\nThis artifact demonstrates my growth in sociological theory by applying the sociological imagination, labeling theory, and conflict theory to real-life experiences with schools, probation, courts, and authority figures. Instead of treating those experiences as only personal struggles, I use sociology to examine how institutions label certain young people and shape how they are treated.\n\n### Why I selected this artifact\nI selected this artifact because it shows one of the biggest shifts in my thinking as a sociology major. It helped me understand that labels like “difficult,” “disobedient,” or “problematic” are not harmless. They can follow people through schools, courts, official records, and personal identity. This artifact represents theory because it uses sociological concepts to explain how power, inequality, and institutional judgment affect people’s lives.",
    skills: ["Sociological imagination", "Labeling theory", "Conflict theory", "Institutional analysis", "Critical thinking", "Written communication"]
  },
  {
    id: "methods-artifact",
    title: "Fairness on Trial: Structural Bias in Jury Selection",
    category: "Methods",
    summary: "Course/Context: Sociology symposium research poster",
    icon: "Pen",
    content: "### Annotation\nThis artifact demonstrates my ability to use research, evidence, legal cases, data, and sociological analysis to examine a social problem. The project studies how jury selection can appear neutral while still allowing bias through discretionary exclusions, race-neutral explanations, and unequal representation.\n\n### Why I selected this artifact\nI selected this artifact because it shows my growth in research, evidence-based analysis, and public-facing sociology, moving beyond theory into applied methodological inquiry.\n\n### What it demonstrates about my sociological learning or growth\nIt demonstrates my capability to critically evaluate legal systems and systemic inequality using structured sociological methods and empirical evidence.",
    skills: ["Research", "Evidence Analysis", "Data Interpretation", "Sociological Analysis"]
  },
  {
    id: "advanced-studies-artifact",
    title: "How Supreme Court Rulings Slow Real Progress for Minorities",
    category: "Advanced Studies",
    summary: "Course/Context: CRJ 117 Constitutional Protections Essay",
    icon: "Scale",
    content: "### Annotation\nThis artifact demonstrates advanced analysis of law, courts, policing, constitutional rights, and racial inequality. The paper analyzes Elie Mystal, Terry v. Ohio, McCleskey v. Kemp, police discretion, and the gap between constitutional protections on paper and unequal treatment in practice.\n\n### Why I selected this artifact\nI selected this artifact because it shows my ability to connect sociology, criminal justice, legal interpretation, and institutional power at an advanced, interdisciplinary level.\n\n### What it demonstrates about my sociological learning or growth\nIt highlights my development in critically analyzing the intersection of constitutional law and structural inequality, focusing on how systemic biases operate within powerful institutions.",
    skills: ["Institutional Analysis", "Legal Framework Analysis", "Power Dynamics"]
  },
  {
    id: "thematic-areas-artifact",
    title: "From Adversity to Advocacy",
    category: "Thematic Areas",
    summary: "Course/Context: Personal narrative / advocacy-focused academic essay",
    icon: "Target",
    content: "### Annotation\nThis artifact represents the broader themes that shape my sociology work, including foster care, youth systems, juvenile justice, education, family instability, institutional support, and advocacy.\n\n### Why I selected this artifact\nI selected this artifact because it explains the personal foundation behind my interest in sociology, law, and youth advocacy while connecting individual experience to larger social systems.\n\n### What it demonstrates about my sociological learning or growth\nIt demonstrates my ability to integrate personal narrative with sociological paradigms to advocate for institutional reform and systemic awareness.",
    skills: ["Advocacy", "Intersectionality", "Systemic Inquiry"]
  }
];
