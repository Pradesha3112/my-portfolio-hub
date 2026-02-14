const THEME_KEY = "portfolio_theme";

export type ThemeOption =
  | "light" | "dark" | "glassmorphism" | "gradient-blue"
  | "gradient-purple-pink" | "gradient-green-cyan" | "gradient-orange-yellow"
  | "gradient-red-black" | "minimal-pastel" | "cyber-neon";

const allThemeClasses = [
  "dark", "glassmorphism", "gradient-blue",
  "gradient-purple-pink", "gradient-green-cyan", "gradient-orange-yellow",
  "gradient-red-black", "minimal-pastel", "cyber-neon",
];

export const themeOptions: { value: ThemeOption; label: string; description: string; preview: string }[] = [
  { value: "light", label: "Light Theme", description: "Clean and bright", preview: "bg-[hsl(0,0%,98%)] border border-[hsl(0,0%,85%)]" },
  { value: "dark", label: "Dark Theme", description: "Easy on the eyes", preview: "bg-[hsl(0,0%,15%)]" },
  { value: "glassmorphism", label: "Glassmorphism", description: "Frosted glass effect", preview: "bg-gradient-to-br from-[hsl(250,60%,80%)] to-[hsl(280,40%,85%)]" },
  { value: "gradient-blue", label: "Gradient Blue", description: "Modern blue gradient", preview: "bg-gradient-to-br from-[hsl(200,90%,55%)] to-[hsl(215,80%,30%)]" },
  { value: "gradient-purple-pink", label: "Purple–Pink", description: "Vibrant purple to pink", preview: "bg-gradient-to-br from-[hsl(280,70%,50%)] to-[hsl(330,80%,55%)]" },
  { value: "gradient-green-cyan", label: "Green–Cyan", description: "Fresh green to cyan", preview: "bg-gradient-to-br from-[hsl(160,70%,40%)] to-[hsl(190,80%,50%)]" },
  { value: "gradient-orange-yellow", label: "Orange–Yellow", description: "Warm sunset gradient", preview: "bg-gradient-to-br from-[hsl(25,90%,55%)] to-[hsl(45,95%,55%)]" },
  { value: "gradient-red-black", label: "Red–Black Dark", description: "Bold dark red gradient", preview: "bg-gradient-to-br from-[hsl(0,70%,40%)] to-[hsl(0,0%,10%)]" },
  { value: "minimal-pastel", label: "Minimal Pastel", description: "Soft pastel colors", preview: "bg-gradient-to-br from-[hsl(340,50%,90%)] to-[hsl(200,50%,90%)]" },
  { value: "cyber-neon", label: "Cyber Neon", description: "Dark with neon accents", preview: "bg-[hsl(240,20%,8%)] border border-[hsl(160,100%,50%)]" },
];

export function getSavedTheme(): ThemeOption {
  return (localStorage.getItem(THEME_KEY) as ThemeOption) || "light";
}

export function saveTheme(theme: ThemeOption) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme: ThemeOption) {
  const root = document.documentElement;
  allThemeClasses.forEach((c) => root.classList.remove(c));

  if (theme !== "light") {
    root.classList.add(theme);
  }
}
