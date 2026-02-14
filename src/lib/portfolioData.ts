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
  startDate?: string;
  endDate?: string;
  singleDate?: string;
}

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
}

export interface Certification {
  id: string;
  title: string;
  platform: string;
  date: string;
  certificateUrl?: string;
}

// Certification is now defined above with Project

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
  lastEdited: string;
}

const defaultData: PortfolioData = {
  name: "Pradesha S",
  role: "Aspiring UI/UX Designer",
  intro: "A passionate UI/UX designer and IT student with hands-on experience in Python, web development, and design tools like Figma and Canva. Driven by creativity and problem-solving, I build interactive prototypes, technical blogs, and innovative visual solutions.",
  email: "pradesha3112@gmail.com",
  linkedin: "https://www.linkedin.com/in/pradesha",
  github: "https://github.com/Pradesha3112",
  skills: {
    languages: ["Python", "HTML", "CSS", "JavaScript"],
    tools: ["Git", "GitHub", "Canva", "MS Excel", "PowerPoint", "Figma", "WordPress"],
    platforms: ["Jupyter Notebook", "Visual Studio Code", "Google Colab"],
    other: ["Analytical Skills", "Problem Solving", "Creative Thinking", "Basic UI/UX Design"],
  },
  skillLevels: {
    Python: "Intermediate", HTML: "Advanced", CSS: "Advanced", JavaScript: "Intermediate",
    Git: "Intermediate", GitHub: "Intermediate", Canva: "Advanced", "MS Excel": "Intermediate",
    PowerPoint: "Intermediate", Figma: "Intermediate", WordPress: "Intermediate",
    "Jupyter Notebook": "Intermediate", "Visual Studio Code": "Advanced", "Google Colab": "Intermediate",
  },
  education: [
    {
      id: "edu1",
      institution: "SRM Madurai College for Engineering and Technology, Sivaganga",
      course: "B.Tech Information Technology",
      duration: "August 2023 – May 2027",
      score: "GPA: 8.27",
    },
    {
      id: "edu2",
      institution: "Rajan Matric Higher Secondary School, Madurai",
      course: "Computer Science – Mathematics",
      duration: "June 2021 – May 2023",
      score: "Percentage: 87.3%",
    },
  ],
  internships: [
    {
      id: "int1",
      role: "Python & OpenCV Trainee",
      organization: "Quantanics Techserv Pvt Ltd",
      duration: "Jan 20 – Feb 3",
      responsibilities: "Applied Python and OpenCV to practical applications in computer vision. Demonstrated a proactive approach in problem solving and a keen interest in learning.",
    },
  ],
  projects: [
    {
      id: "proj1",
      title: "Health Check AI Prototype",
      description: "Designed UI for Health Check AI tool in Figma. Built interactive prototype for wellness dashboard.",
      techStack: ["Figma", "UI/UX"],
      link: "",
      featured: true,
    },
    {
      id: "proj2",
      title: "Tic Tac Toe Game Prototype",
      description: "Created game UI mock-up using Figma. Prototyped 2-player and AI modes visually.",
      techStack: ["Figma", "UI/UX"],
      link: "",
      featured: true,
    },
    {
      id: "proj3",
      title: "Technical Blog",
      description: "Built a technical blog using WordPress. Customized themes, created SEO-friendly content.",
      techStack: ["WordPress", "SEO"],
      link: "",
      featured: true,
    },
    {
      id: "proj4",
      title: "Innovative Solutions for IT",
      description: "Designed a professional IT solutions deck using Canva. Visualized complex tech concepts into clear, creative slides.",
      techStack: ["Canva", "Design"],
      link: "",
      featured: false,
    },
  ],
  certifications: [
    { id: "cert1", title: "Python for Data Science (75%)", platform: "NPTEL", date: "" },
    { id: "cert2", title: "Object-Oriented Programming in Python", platform: "SRM IST", date: "" },
    { id: "cert3", title: "Data Science Tools for AI Application", platform: "SRM IST", date: "" },
    { id: "cert4", title: "Generative AI for Leaders", platform: "Udemy", date: "" },
    { id: "cert5", title: "Placement Training (96%)", platform: "Internshala", date: "" },
  ],
  achievements: [
    "Scored 75% in NPTEL Python for Data Science certification",
    "96% in Internshala Placement Training",
    "GPA 8.27 in B.Tech Information Technology",
    "87.3% in Higher Secondary (Computer Science – Mathematics)",
  ],
  lastEdited: new Date().toISOString(),
};

const STORAGE_KEY = "portfolio_data";
const HISTORY_KEY = "portfolio_history";

export function getPortfolioData(): PortfolioData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultData;
    }
  }
  return defaultData;
}

export function savePortfolioData(data: PortfolioData) {
  // Save current as history before updating
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
