// Default portfolio data extracted from Pradesha's resume
// All data is persisted in localStorage

export interface Education {
  id: string;
  institution: string;
  course: string;
  duration: string;
  score: string;
}

export interface Internship {
  id: string;
  role: string;
  organization: string;
  duration: string;
  responsibilities: string;
  responsibilityBullets?: string[];
  techStack?: string[];
  startDate?: string;
  endDate?: string;
  singleDate?: string;
  thumbnail?: string;
}

export type ProjectMotivation = "College/Work" | "Personal Interest" | "Hackathon" | "Technical Event" | "Other";

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link: string;
  featured: boolean;
  startDate?: string;
  endDate?: string;
  singleDate?: string;
  demoUrl?: string;
  demoVideoUrl?: string;
  images?: string[];
  thumbnail?: string;
  keyFeatures?: string[];
  githubLink?: string;
  skillsToLearn?: string[];
  motivation?: ProjectMotivation;
  motivationOther?: string;
  screenshots?: string[];
}

export interface Certification {
  id: string;
  title: string;
  platform: string;
  date: string;
  certificateUrl?: string;
  thumbnail?: string;
}

export type ResumeSectionId = "summary" | "skills" | "projects" | "experience" | "certifications" | "education" | "achievements";

export const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [
  "summary", "skills", "projects", "experience", "certifications", "education", "achievements"
];

export interface ResumeFormatting {
  nameFontSize: number;
  headingFontSize: number;
  bodyFontSize: number;
  contactFontSize: number;
  marginMM: number;
  sectionGapBefore: number;
  sectionGapAfter: number;
  bulletSpacing: number;
  lineHeightMultiplier: number;
  showSectionLines: boolean;
  hiddenSections: ResumeSectionId[];
  headingColor: string;
  nameStyle: "normal" | "bold" | "italic";
  headingStyle: "normal" | "bold" | "italic";
  bodyStyle: "normal" | "bold" | "italic";
  itemSpacing: number;        // gap between entries (projects, experiences, education)
  headerContentGap: number;   // gap after entry title/role line
  subItemSpacing: number;     // gap after tech stack, links, org name
}

export const DEFAULT_FORMATTING: ResumeFormatting = {
  nameFontSize: 16,
  headingFontSize: 12,
  bodyFontSize: 10.5,
  contactFontSize: 9,
  marginMM: 25.4,
  sectionGapBefore: 7,
  sectionGapAfter: 5,
  bulletSpacing: 1.5,
  lineHeightMultiplier: 1.3,
  showSectionLines: true,
  hiddenSections: [],
  headingColor: "#000000",
  nameStyle: "bold",
  headingStyle: "bold",
  bodyStyle: "normal",
  itemSpacing: 3,
  headerContentGap: 4.5,
  subItemSpacing: 3.5,
};

export interface ResumeSelections {
  selectedProjects: string[];
  selectedInternships: string[];
  selectedCertifications: string[];
  selectedSkillCategories: ("languages" | "tools" | "platforms" | "other")[];
  sectionOrder: ResumeSectionId[];
}

export interface PortfolioData {
  name: string;
  role: string;
  intro: string;
  email: string;
  linkedin: string;
  github: string;
  skills: {
    languages: string[];
    tools: string[];
    platforms: string[];
    other: string[];
  };
  skillLevels: Record<string, "Beginner" | "Intermediate" | "Advanced">;
  education: Education[];
  internships: Internship[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  resumeSelections: ResumeSelections;
  resumeFormatting: ResumeFormatting;
  lastEdited: string;
}

const defaultData: PortfolioData = {
  name: "Pradesha S",
  role: "Python Developer | Front-End Developer | Software Engineer Intern",
  intro: "Results-driven Information Technology student with hands-on experience in Python programming, front-end web development, and UI/UX design. Proficient in building responsive web applications using HTML, CSS, JavaScript, and modern frameworks. Skilled in REST API integration, database management, version control with Git, and agile development practices. Strong problem-solving abilities with a proven track record of delivering user-centric digital solutions and optimizing application performance by up to 30%.",
  email: "pradesha3112@gmail.com",
  linkedin: "https://www.linkedin.com/in/pradesha",
  github: "https://github.com/Pradesha3112",
  skills: {
    languages: ["Python", "HTML5", "CSS3", "JavaScript", "SQL"],
    tools: ["Git", "GitHub", "Figma", "REST API", "JSON", "WordPress", "Bootstrap", "Responsive Design", "CRUD Operations", "MySQL"],
    platforms: ["VS Code", "Jupyter Notebook", "Google Colab", "Linux", "Windows"],
    other: ["Problem Solving", "Data Structures", "Algorithms", "Agile Methodology", "Technical Documentation", "Team Collaboration"],
  },
  skillLevels: {
    Python: "Intermediate", HTML5: "Advanced", CSS3: "Advanced", JavaScript: "Intermediate", SQL: "Intermediate",
    Git: "Intermediate", GitHub: "Intermediate", Figma: "Intermediate", "REST API": "Intermediate",
    WordPress: "Intermediate", Bootstrap: "Intermediate", MySQL: "Intermediate",
    "VS Code": "Advanced", "Jupyter Notebook": "Intermediate", "Google Colab": "Intermediate",
  },
  education: [
    {
      id: "edu1",
      institution: "SRM Madurai College for Engineering and Technology, Sivaganga",
      course: "B.Tech Information Technology",
      duration: "August 2023 – May 2027",
      score: "GPA: 8.27 / 10.0",
    },
    {
      id: "edu2",
      institution: "Rajan Matric Higher Secondary School, Madurai",
      course: "Higher Secondary – Computer Science & Mathematics",
      duration: "June 2021 – May 2023",
      score: "Percentage: 87.3%",
    },
  ],
  internships: [
    {
      id: "int1",
      role: "Python Developer Intern",
      organization: "Quantanics Techserv Pvt Ltd",
      duration: "Jan 2024 – Feb 2024",
      responsibilities: "Developed 5+ computer vision applications using Python and OpenCV, including real-time object detection and image processing pipelines. Optimized image processing algorithms, reducing execution time by 25%. Collaborated with a cross-functional team of 4 developers to implement automated testing workflows. Documented technical specifications and created reusable code modules for future projects.",
    },
  ],
  projects: [
    {
      id: "proj1",
      title: "Health Check AI – Wellness Dashboard",
      description: "Engineered a full-stack wellness monitoring dashboard with Python backend and responsive front-end. Implemented REST API endpoints for health data retrieval and user authentication. Designed interactive data visualizations displaying real-time health metrics for 100+ data points. Achieved 95% user satisfaction score during usability testing with 20 participants.",
      techStack: ["Python", "HTML5", "CSS3", "JavaScript", "REST API", "Figma"],
      link: "",
      featured: true,
    },
    {
      id: "proj2",
      title: "Task Manager Web Application",
      description: "Built a responsive CRUD-based task management application using Python and SQL database. Implemented user authentication, task categorization, and priority-based sorting features. Developed RESTful API endpoints for seamless front-end and back-end communication. Reduced task completion tracking time by 40% through automated status updates.",
      techStack: ["Python", "SQL", "HTML5", "CSS3", "JavaScript", "Bootstrap"],
      link: "",
      featured: true,
    },
    {
      id: "proj3",
      title: "Technical Blog Platform",
      description: "Developed and deployed a fully responsive technical blog platform with WordPress CMS. Implemented SEO optimization strategies, increasing organic traffic by 50% within 3 months. Created 15+ technical articles on Python, web development, and software engineering best practices. Customized themes and plugins to improve page load speed by 35%.",
      techStack: ["WordPress", "HTML5", "CSS3", "SEO", "Responsive Design"],
      link: "",
      featured: true,
    },
    {
      id: "proj4",
      title: "E-Commerce Product Catalog",
      description: "Designed and developed a responsive e-commerce product catalog with search and filter functionality. Implemented dynamic product listing using JavaScript and JSON data integration. Built responsive UI components ensuring cross-browser compatibility across 5+ browsers. Optimized front-end performance, achieving a Lighthouse score of 90+.",
      techStack: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "JSON", "Responsive Design"],
      link: "",
      featured: false,
    },
  ],
  certifications: [
    { id: "cert1", title: "Python for Data Science (75%)", platform: "NPTEL (IIT Madras)", date: "2024" },
    { id: "cert2", title: "Object-Oriented Programming in Python", platform: "SRM IST", date: "2024" },
    { id: "cert3", title: "Data Science Tools for AI Application", platform: "SRM IST", date: "2024" },
    { id: "cert4", title: "Generative AI for Leaders", platform: "Udemy", date: "2024" },
    { id: "cert5", title: "Placement Training (96%)", platform: "Internshala", date: "2024" },
  ],
  achievements: [
    "Scored 75% in NPTEL Python for Data Science certification by IIT Madras",
    "Achieved 96% in Internshala Placement Training program",
    "Maintained 8.27 GPA in B.Tech Information Technology (Top 10% of class)",
    "Secured 87.3% in Higher Secondary with distinction in Computer Science",
  ],
  resumeSelections: {
    selectedProjects: [],
    selectedInternships: [],
    selectedCertifications: [],
    selectedSkillCategories: ["languages", "tools", "platforms", "other"],
    sectionOrder: ["summary", "skills", "experience", "projects", "certifications", "education", "achievements"],
  },
  resumeFormatting: { ...DEFAULT_FORMATTING },
  lastEdited: new Date().toISOString(),
};

const STORAGE_KEY = "portfolio_data";
const HISTORY_KEY = "portfolio_history";

export function getPortfolioData(): PortfolioData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure resumeSelections exists for older data
      if (!parsed.resumeSelections) {
        parsed.resumeSelections = defaultData.resumeSelections;
      }
      if (!parsed.resumeSelections.sectionOrder) {
        parsed.resumeSelections.sectionOrder = defaultData.resumeSelections.sectionOrder;
      }
      if (!parsed.resumeFormatting) {
        parsed.resumeFormatting = { ...DEFAULT_FORMATTING };
      }
      return parsed;
    } catch {
      return defaultData;
    }
  }
  return defaultData;
}

export function savePortfolioData(data: PortfolioData) {
  const current = localStorage.getItem(STORAGE_KEY);
  if (current) {
    localStorage.setItem(HISTORY_KEY, current);
  }
  data.lastEdited = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function undoChanges(): PortfolioData {
  const history = localStorage.getItem(HISTORY_KEY);
  if (history) {
    localStorage.setItem(STORAGE_KEY, history);
    localStorage.removeItem(HISTORY_KEY);
    return JSON.parse(history);
  }
  return getPortfolioData();
}

export function resetToDefault(): PortfolioData {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(HISTORY_KEY);
  return defaultData;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Get items for resume respecting selections and limits
export function getResumeItems(data: PortfolioData) {
  const sel = data.resumeSelections;

  // Projects: use selected, fallback to featured/first, max 3
  let projects = sel.selectedProjects.length > 0
    ? data.projects.filter((p) => sel.selectedProjects.includes(p.id))
    : data.projects.filter((p) => p.featured);
  if (projects.length === 0) projects = [...data.projects];
  projects = projects.slice(0, 3);

  // Internships: use selected, fallback to first, max 2
  let internships = sel.selectedInternships.length > 0
    ? data.internships.filter((i) => sel.selectedInternships.includes(i.id))
    : [...data.internships];
  internships = internships.slice(0, 2);

  // Certifications: use selected, fallback to first, max 4
  let certifications = sel.selectedCertifications.length > 0
    ? data.certifications.filter((c) => sel.selectedCertifications.includes(c.id))
    : [...data.certifications];
  certifications = certifications.slice(0, 4);

  // Skills: use selected categories
  const skillCategories = sel.selectedSkillCategories.length > 0
    ? sel.selectedSkillCategories
    : (["languages", "tools", "platforms", "other"] as const);

  return { projects, internships, certifications, skillCategories };
}
