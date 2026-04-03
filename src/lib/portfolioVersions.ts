// Portfolio version definitions — each version overrides parts of the default data
import type { PortfolioData, Education, Internship, Certification } from "./portfolioData";

export type PortfolioVersionId = "frontend" | "python" | "ai";

export interface PortfolioVersion {
  id: PortfolioVersionId;
  label: string;
  description: string;
  icon: string;
  overrides: Partial<Pick<PortfolioData,
    "role" | "intro" | "skills" | "skillLevels" | "projects" | "achievements" |
    "education" | "internships" | "certifications"
  >>;
}

const SHARED_EDUCATION: Education[] = [
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
];

export const PORTFOLIO_VERSIONS: PortfolioVersion[] = [
  {
    id: "frontend",
    label: "Frontend Portfolio",
    description: "Focused on web development, UI/UX, and responsive design",
    icon: "🎨",
    overrides: {
      role: "Front-End Developer | UI/UX Designer | Web Developer",
      intro:
        "Creative front-end developer passionate about crafting responsive, accessible, and visually stunning web experiences. Proficient in HTML5, CSS3, JavaScript, React, and modern UI frameworks. Experienced in translating Figma designs into pixel-perfect interfaces with smooth animations and cross-browser compatibility.",
      skills: {
        languages: ["HTML5", "CSS3", "JavaScript", "TypeScript"],
        tools: ["React", "Tailwind CSS", "Figma", "Bootstrap", "Git", "GitHub", "REST API", "Responsive Design", "Framer Motion"],
        platforms: ["VS Code", "Chrome DevTools", "Vercel", "Netlify"],
        other: ["UI/UX Design", "Accessibility (WCAG)", "Cross-Browser Testing", "Agile Methodology", "Component Libraries"],
      },
      skillLevels: {
        HTML5: "Advanced",
        CSS3: "Advanced",
        JavaScript: "Advanced",
        TypeScript: "Intermediate",
        React: "Intermediate",
        "Tailwind CSS": "Intermediate",
        Figma: "Intermediate",
        Bootstrap: "Advanced",
        "Responsive Design": "Advanced",
      },
      education: SHARED_EDUCATION,
      internships: [
        {
          id: "fint1",
          role: "Front-End Developer Intern",
          organization: "Quantanics Techserv Pvt Ltd",
          duration: "Jan 2024 – Feb 2024",
          responsibilities: "Built responsive UI components for internal dashboards using HTML5, CSS3, and JavaScript. Translated Figma mockups into pixel-perfect web pages with cross-browser compatibility. Optimized front-end performance achieving Lighthouse scores of 90+. Collaborated with backend team to integrate REST APIs into the front-end.",
        },
      ],
      certifications: [
        { id: "fcert1", title: "Responsive Web Design", platform: "freeCodeCamp", date: "2024" },
        { id: "fcert2", title: "JavaScript Algorithms and Data Structures", platform: "freeCodeCamp", date: "2024" },
        { id: "fcert3", title: "Placement Training (96%)", platform: "Internshala", date: "2024" },
        { id: "fcert4", title: "UI/UX Design Fundamentals", platform: "Coursera", date: "2024" },
      ],
      projects: [
        {
          id: "fproj1",
          title: "Health Check AI – Wellness Dashboard",
          description:
            "Engineered a responsive wellness monitoring dashboard with interactive data visualizations. Built pixel-perfect UI from Figma designs using HTML5, CSS3, and JavaScript. Implemented animated health metric charts and achieved 95% user satisfaction in usability testing.",
          techStack: ["HTML5", "CSS3", "JavaScript", "Figma", "REST API", "Chart.js"],
          link: "",
          featured: true,
        },
        {
          id: "fproj2",
          title: "E-Commerce Product Catalog",
          description:
            "Designed and developed a responsive e-commerce product catalog with search, filtering, and sorting. Built reusable UI components ensuring cross-browser compatibility across 5+ browsers. Achieved Lighthouse score of 90+ with optimized performance.",
          techStack: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "JSON", "Responsive Design"],
          link: "",
          featured: true,
        },
        {
          id: "fproj3",
          title: "Technical Blog Platform",
          description:
            "Built a fully responsive technical blog with custom WordPress theme. Implemented SEO optimization increasing organic traffic by 50%. Customized themes and plugins to improve page load speed by 35%.",
          techStack: ["WordPress", "HTML5", "CSS3", "SEO", "Responsive Design"],
          link: "",
          featured: true,
        },
        {
          id: "fproj4",
          title: "Task Manager Web Application",
          description:
            "Built a responsive task management interface with drag-and-drop, filtering, and priority sorting. Designed clean, intuitive UI with smooth animations and transitions.",
          techStack: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
          link: "",
          featured: false,
        },
      ],
      achievements: [
        "Achieved Lighthouse performance score of 90+ on multiple web projects",
        "Increased organic web traffic by 50% through SEO optimization",
        "Improved page load speed by 35% through front-end optimization",
        "Maintained 8.27 GPA in B.Tech Information Technology (Top 10% of class)",
      ],
    },
  },
  {
    id: "python",
    label: "Python Portfolio",
    description: "Focused on Python development, backend, and data science",
    icon: "🐍",
    overrides: {
      role: "Python Developer | Backend Engineer | Data Science Enthusiast",
      intro:
        "Results-driven Python developer with hands-on experience in building scalable applications, REST APIs, and data processing pipelines. Proficient in Python, Django, Flask, SQL, and machine learning libraries. Strong problem-solving abilities with a proven track record of optimizing algorithms and reducing execution time by 25%.",
      skills: {
        languages: ["Python", "SQL", "JavaScript", "Bash"],
        tools: ["Django", "Flask", "REST API", "OpenCV", "NumPy", "Pandas", "Git", "GitHub", "MySQL", "CRUD Operations"],
        platforms: ["VS Code", "Jupyter Notebook", "Google Colab", "Linux", "Docker"],
        other: ["Data Structures", "Algorithms", "Machine Learning Basics", "Agile Methodology", "Technical Documentation", "Test-Driven Development"],
      },
      skillLevels: {
        Python: "Advanced",
        SQL: "Intermediate",
        JavaScript: "Intermediate",
        Django: "Intermediate",
        Flask: "Intermediate",
        OpenCV: "Intermediate",
        NumPy: "Intermediate",
        Pandas: "Intermediate",
        MySQL: "Intermediate",
      },
      education: SHARED_EDUCATION,
      internships: [
        {
          id: "pint1",
          role: "Python Developer Intern",
          organization: "Quantanics Techserv Pvt Ltd",
          duration: "Jan 2024 – Feb 2024",
          responsibilities: "Developed 5+ computer vision applications using Python and OpenCV, including real-time object detection and image processing pipelines. Optimized image processing algorithms, reducing execution time by 25%. Collaborated with a cross-functional team of 4 developers to implement automated testing workflows. Documented technical specifications and created reusable code modules for future projects.",
        },
      ],
      certifications: [
        { id: "pcert1", title: "Python for Data Science (75%)", platform: "NPTEL (IIT Madras)", date: "2024" },
        { id: "pcert2", title: "Object-Oriented Programming in Python", platform: "SRM IST", date: "2024" },
        { id: "pcert3", title: "Data Science Tools for AI Application", platform: "SRM IST", date: "2024" },
        { id: "pcert4", title: "Placement Training (96%)", platform: "Internshala", date: "2024" },
      ],
      projects: [
        {
          id: "pproj1",
          title: "Health Check AI – Wellness Dashboard",
          description:
            "Engineered a full-stack wellness monitoring application with Python backend and REST API endpoints. Implemented health data retrieval, user authentication, and real-time metrics processing for 100+ data points. Achieved 95% user satisfaction score during usability testing.",
          techStack: ["Python", "Flask", "REST API", "SQL", "JSON"],
          link: "",
          featured: true,
        },
        {
          id: "pproj2",
          title: "Task Manager Web Application",
          description:
            "Built a CRUD-based task management application using Python and SQL database. Implemented user authentication, task categorization, and priority-based sorting. Developed RESTful API endpoints and reduced task tracking time by 40%.",
          techStack: ["Python", "SQL", "Flask", "REST API"],
          link: "",
          featured: true,
        },
        {
          id: "pproj3",
          title: "Computer Vision Pipeline",
          description:
            "Developed 5+ computer vision applications using Python and OpenCV including real-time object detection and image processing pipelines. Optimized image processing algorithms, reducing execution time by 25%.",
          techStack: ["Python", "OpenCV", "NumPy", "Image Processing"],
          link: "",
          featured: true,
        },
        {
          id: "pproj4",
          title: "Data Analysis Dashboard",
          description:
            "Built an automated data analysis pipeline with Pandas and NumPy for processing large CSV datasets. Generated statistical reports and visualizations using Matplotlib.",
          techStack: ["Python", "Pandas", "NumPy", "Matplotlib"],
          link: "",
          featured: false,
        },
      ],
      achievements: [
        "Scored 75% in NPTEL Python for Data Science certification by IIT Madras",
        "Optimized image processing algorithms reducing execution time by 25%",
        "Achieved 96% in Internshala Placement Training program",
        "Maintained 8.27 GPA in B.Tech Information Technology (Top 10% of class)",
      ],
    },
  },
  {
    id: "ai",
    label: "AI Portfolio",
    description: "Focused on artificial intelligence, ML, and data science",
    icon: "🤖",
    overrides: {
      role: "AI/ML Developer | Data Scientist | Python Developer",
      intro:
        "Aspiring AI/ML developer with strong foundations in Python, data science, and machine learning. Experienced in building computer vision applications with OpenCV, data analysis pipelines with Pandas/NumPy, and exploring generative AI. Passionate about leveraging artificial intelligence to solve real-world problems and create intelligent systems.",
      skills: {
        languages: ["Python", "SQL", "JavaScript", "R"],
        tools: ["OpenCV", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "Matplotlib", "Jupyter", "Git", "REST API", "JSON"],
        platforms: ["Google Colab", "Jupyter Notebook", "Kaggle", "VS Code", "Linux"],
        other: ["Machine Learning", "Computer Vision", "Data Analysis", "Neural Networks", "NLP Basics", "Statistical Modeling", "Agile Methodology"],
      },
      skillLevels: {
        Python: "Advanced",
        OpenCV: "Intermediate",
        NumPy: "Intermediate",
        Pandas: "Intermediate",
        "Scikit-learn": "Beginner",
        TensorFlow: "Beginner",
        "Machine Learning": "Intermediate",
        "Computer Vision": "Intermediate",
        SQL: "Intermediate",
      },
      education: SHARED_EDUCATION,
      internships: [
        {
          id: "aint1",
          role: "AI/ML Developer Intern",
          organization: "Quantanics Techserv Pvt Ltd",
          duration: "Jan 2024 – Feb 2024",
          responsibilities: "Developed 5+ computer vision applications using Python and OpenCV including real-time object detection, face recognition, and image segmentation. Built data processing pipelines for training ML models. Optimized ML pipeline execution time by 25%. Explored generative AI techniques and documented AI project workflows.",
        },
      ],
      certifications: [
        { id: "acert1", title: "Python for Data Science (75%)", platform: "NPTEL (IIT Madras)", date: "2024" },
        { id: "acert2", title: "Generative AI for Leaders", platform: "Udemy", date: "2024" },
        { id: "acert3", title: "Data Science Tools for AI Application", platform: "SRM IST", date: "2024" },
        { id: "acert4", title: "Machine Learning Foundations", platform: "Coursera", date: "2024" },
      ],
      projects: [
        {
          id: "aproj1",
          title: "Computer Vision Pipeline",
          description:
            "Developed 5+ computer vision applications using Python and OpenCV including real-time object detection, face recognition, and image segmentation. Optimized processing pipelines reducing execution time by 25%. Implemented automated testing workflows for model validation.",
          techStack: ["Python", "OpenCV", "NumPy", "Computer Vision"],
          link: "",
          featured: true,
        },
        {
          id: "aproj2",
          title: "Health Check AI – Wellness Predictor",
          description:
            "Built an AI-powered wellness monitoring system that analyzes health data to predict patterns and anomalies. Implemented data pipelines for processing 100+ health metrics with visualization dashboards.",
          techStack: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "REST API"],
          link: "",
          featured: true,
        },
        {
          id: "aproj3",
          title: "Sentiment Analysis Tool",
          description:
            "Created a text sentiment analysis tool using NLP techniques and machine learning classifiers. Processed and classified text data with 85% accuracy using bag-of-words and TF-IDF features.",
          techStack: ["Python", "NLTK", "Scikit-learn", "Pandas"],
          link: "",
          featured: true,
        },
        {
          id: "aproj4",
          title: "Data Analysis Dashboard",
          description:
            "Built an automated data analysis pipeline for exploratory data analysis on large datasets. Generated statistical reports, correlation matrices, and interactive visualizations.",
          techStack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
          link: "",
          featured: false,
        },
      ],
      achievements: [
        "Scored 75% in NPTEL Python for Data Science certification by IIT Madras",
        "Completed Generative AI for Leaders certification on Udemy",
        "Developed 5+ computer vision applications with real-time object detection",
        "Optimized ML pipeline execution time by 25%",
      ],
    },
  },
];

const VERSION_STORAGE_KEY = "portfolio_version";

export function getStoredVersion(): PortfolioVersionId {
  const stored = localStorage.getItem(VERSION_STORAGE_KEY);
  if (stored && ["frontend", "python", "ai"].includes(stored)) {
    return stored as PortfolioVersionId;
  }
  return "python"; // default matches original data
}

export function setStoredVersion(id: PortfolioVersionId) {
  localStorage.setItem(VERSION_STORAGE_KEY, id);
}

export function getVersionById(id: PortfolioVersionId): PortfolioVersion {
  return PORTFOLIO_VERSIONS.find((v) => v.id === id)!;
}

export function applyVersionOverrides(
  base: PortfolioData,
  versionId: PortfolioVersionId
): PortfolioData {
  const version = getVersionById(versionId);
  const o = version.overrides;
  return {
    ...base,
    role: o.role ?? base.role,
    intro: o.intro ?? base.intro,
    skills: o.skills ?? base.skills,
    skillLevels: o.skillLevels ?? base.skillLevels,
    projects: o.projects ?? base.projects,
    achievements: o.achievements ?? base.achievements,
    education: o.education ?? base.education,
    internships: o.internships ?? base.internships,
    certifications: o.certifications ?? base.certifications,
    email: base.email,
    linkedin: base.linkedin,
    github: base.github,
    name: base.name,
    resumeSelections: base.resumeSelections,
    resumeFormatting: base.resumeFormatting,
    lastEdited: base.lastEdited,
  };
}
