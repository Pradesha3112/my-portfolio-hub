import { type PortfolioData, type ResumeFormatting, DEFAULT_FORMATTING, getResumeItems } from "./portfolioData";

export interface ATSCategory {
  name: string;
  score: number;      // 0–100
  maxScore: number;   // always 100
  icon: string;
  suggestions: string[];
}

export interface ATSResult {
  totalScore: number;
  categories: ATSCategory[];
}

const ACTION_VERBS = [
  "achieved", "analyzed", "built", "collaborated", "created", "delivered", "designed",
  "developed", "engineered", "enhanced", "established", "generated", "implemented",
  "improved", "increased", "integrated", "launched", "led", "managed", "migrated",
  "optimized", "orchestrated", "reduced", "refactored", "resolved", "scaled",
  "spearheaded", "streamlined", "supervised", "transformed", "upgraded",
];

const QUANTIFIERS = /\d+%|\d+x|\$\d|\d+ (users|clients|projects|teams|months|years|customers)/i;

export function analyzeATS(data: PortfolioData): ATSResult {
  const fmt: ResumeFormatting = { ...DEFAULT_FORMATTING, ...data.resumeFormatting };
  const { projects, internships, certifications, skillCategories } = getResumeItems(data);

  const categories: ATSCategory[] = [
    analyzeFormatting(fmt),
    analyzeStructure(data, projects, internships, certifications, skillCategories),
    analyzeKeywords(data, projects, internships),
    analyzeReadability(data, fmt, projects, internships),
  ];

  const totalScore = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length);

  return { totalScore, categories };
}

function analyzeFormatting(fmt: ResumeFormatting): ATSCategory {
  let score = 100;
  const suggestions: string[] = [];

  // Font choice — ATS prefers standard fonts
  const atsFonts = ["Helvetica", "Times", "Courier", "Georgia"];
  if (!atsFonts.includes(fmt.fontFamily)) {
    score -= 10;
    suggestions.push("Use a standard ATS-safe font like Helvetica, Times, or Georgia.");
  }

  // Body font size 9–12pt
  if (fmt.bodyFontSize < 9) {
    score -= 15;
    suggestions.push("Body text is too small (<9pt). Increase to at least 9pt for readability.");
  } else if (fmt.bodyFontSize > 12) {
    score -= 5;
    suggestions.push("Body text is larger than 12pt — consider reducing to fit more content.");
  }

  // Margins 15–30mm
  if (fmt.marginMM < 15) {
    score -= 10;
    suggestions.push("Margins are too narrow. Use at least 15mm for clean scanning.");
  } else if (fmt.marginMM > 30) {
    score -= 5;
    suggestions.push("Margins are very wide — you may be wasting valuable space.");
  }

  // Section lines help ATS parse
  if (fmt.showSectionLines) {
    score = Math.min(score + 5, 100);
  } else {
    suggestions.push("Consider adding section divider lines — they help ATS parsers identify sections.");
  }

  // Line height
  if (fmt.lineHeightMultiplier < 1.15) {
    score -= 10;
    suggestions.push("Line height is very tight. Increase to at least 1.2 for better readability.");
  }

  if (suggestions.length === 0) suggestions.push("Formatting looks great for ATS parsing!");

  return { name: "Formatting", score: Math.max(score, 0), maxScore: 100, icon: "📐", suggestions };
}

function analyzeStructure(
  data: PortfolioData,
  projects: any[],
  internships: any[],
  certifications: any[],
  skillCategories: string[],
): ATSCategory {
  let score = 0;
  const suggestions: string[] = [];

  // Contact info completeness
  let contactScore = 0;
  if (data.name?.trim()) contactScore += 25;
  else suggestions.push("Add your full name to the resume header.");
  if (data.email?.trim()) contactScore += 25;
  else suggestions.push("Include an email address for contact.");
  if (data.linkedin?.trim()) contactScore += 25;
  else suggestions.push("Add your LinkedIn profile URL.");
  if (data.github?.trim()) contactScore += 25;
  else suggestions.push("Consider adding your GitHub profile.");
  score += contactScore * 0.2; // 20 pts max

  // Summary
  if (data.intro?.trim() && data.intro.length > 50) {
    score += 15;
  } else {
    score += 5;
    suggestions.push("Write a professional summary of at least 2–3 sentences highlighting your value.");
  }

  // Skills section
  if (skillCategories.length >= 2) {
    score += 15;
  } else if (skillCategories.length === 1) {
    score += 8;
    suggestions.push("Add skills across multiple categories (languages, tools, platforms) for better keyword matching.");
  } else {
    suggestions.push("Include a skills section — it's critical for ATS keyword matching.");
  }

  // Projects
  if (projects.length >= 2) {
    score += 15;
  } else if (projects.length === 1) {
    score += 8;
    suggestions.push("Add at least 2 projects to demonstrate practical experience.");
  } else {
    suggestions.push("Add projects to showcase hands-on technical skills.");
  }

  // Experience
  if (internships.length >= 1) {
    score += 15;
  } else {
    suggestions.push("Include work experience or internships if available.");
  }

  // Education
  if (data.education?.length >= 1) {
    score += 10;
  } else {
    suggestions.push("Add your education background.");
  }

  // Certifications
  if (certifications.length >= 1) {
    score += 10;
  } else {
    suggestions.push("Adding certifications can strengthen your resume's credibility.");
  }

  if (suggestions.length === 0) suggestions.push("Resume structure is comprehensive!");

  return { name: "Structure", score: Math.min(Math.round(score), 100), maxScore: 100, icon: "🏗️", suggestions };
}

function analyzeKeywords(
  data: PortfolioData,
  projects: any[],
  internships: any[],
): ATSCategory {
  let score = 0;
  const suggestions: string[] = [];

  // Collect all text
  const allText = [
    data.intro,
    ...projects.map(p => p.description),
    ...internships.map(i => i.responsibilities),
    ...internships.flatMap(i => i.responsibilityBullets || []),
  ].join(" ").toLowerCase();

  // Action verbs
  const foundVerbs = ACTION_VERBS.filter(v => allText.includes(v));
  if (foundVerbs.length >= 8) {
    score += 35;
  } else if (foundVerbs.length >= 4) {
    score += 20;
    suggestions.push(`Use more action verbs. Found ${foundVerbs.length} — aim for 8+. Try: ${ACTION_VERBS.filter(v => !foundVerbs.includes(v)).slice(0, 5).join(", ")}.`);
  } else {
    score += 8;
    suggestions.push(`Only ${foundVerbs.length} action verbs found. Start bullet points with verbs like: ${ACTION_VERBS.slice(0, 6).join(", ")}.`);
  }

  // Quantifiable achievements
  const quantMatches = allText.match(QUANTIFIERS);
  if (quantMatches && quantMatches.length >= 3) {
    score += 30;
  } else if (quantMatches) {
    score += 15;
    suggestions.push("Add more quantifiable achievements (e.g., 'increased performance by 30%', 'served 500+ users').");
  } else {
    score += 0;
    suggestions.push("Include measurable results with numbers and percentages to strengthen impact.");
  }

  // Technical skills in descriptions
  const allSkills = [
    ...data.skills.languages,
    ...data.skills.tools,
    ...data.skills.platforms,
  ].map(s => s.toLowerCase());
  const mentionedInDesc = allSkills.filter(s => allText.includes(s));
  const skillRatio = allSkills.length > 0 ? mentionedInDesc.length / allSkills.length : 0;
  if (skillRatio >= 0.5) {
    score += 35;
  } else if (skillRatio >= 0.25) {
    score += 20;
    suggestions.push("Mention more of your listed skills within project/experience descriptions for better ATS matching.");
  } else {
    score += 5;
    suggestions.push("Your descriptions don't reference many of your listed skills. Integrate them naturally into bullet points.");
  }

  if (suggestions.length === 0) suggestions.push("Excellent keyword usage across the resume!");

  return { name: "Keywords", score: Math.min(Math.round(score), 100), maxScore: 100, icon: "🔑", suggestions };
}

function analyzeReadability(
  data: PortfolioData,
  fmt: ResumeFormatting,
  projects: any[],
  internships: any[],
): ATSCategory {
  let score = 100;
  const suggestions: string[] = [];

  // Summary length
  if (data.intro) {
    const words = data.intro.split(/\s+/).length;
    if (words > 80) {
      score -= 10;
      suggestions.push("Professional summary is too long (>80 words). Keep it concise at 40–60 words.");
    } else if (words < 20) {
      score -= 10;
      suggestions.push("Professional summary is too brief. Aim for 40–60 words.");
    }
  }

  // Bullet point length
  const allBullets = [
    ...projects.flatMap(p => p.description.split(/\.\s*/).filter((s: string) => s.trim())),
    ...internships.flatMap(i =>
      i.responsibilityBullets?.length
        ? i.responsibilityBullets
        : i.responsibilities.split(/\.\s*/).filter((s: string) => s.trim())
    ),
  ];
  const longBullets = allBullets.filter((b: string) => b.split(/\s+/).length > 25);
  if (longBullets.length > 0) {
    score -= Math.min(longBullets.length * 5, 20);
    suggestions.push(`${longBullets.length} bullet point(s) exceed 25 words. Keep bullets concise and impactful.`);
  }

  // Too few bullets
  if (allBullets.length < 5) {
    score -= 15;
    suggestions.push("Add more descriptive bullet points to projects and experience sections.");
  }

  // Role title
  if (data.role) {
    if (data.role.split("|").length > 3) {
      score -= 5;
      suggestions.push("Your role title has too many segments. Keep it to 2–3 focused titles.");
    }
  } else {
    score -= 10;
    suggestions.push("Add a clear professional title/role below your name.");
  }

  // Hidden sections warning
  const hiddenCount = fmt.hiddenSections?.length || 0;
  if (hiddenCount >= 3) {
    score -= 10;
    suggestions.push("Multiple sections are hidden. ATS scanners expect comprehensive resumes.");
  }

  if (suggestions.length === 0) suggestions.push("Content is clear and well-structured for readability!");

  return { name: "Readability", score: Math.max(score, 0), maxScore: 100, icon: "📖", suggestions };
}
