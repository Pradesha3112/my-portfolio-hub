const THEME_KEY = "portfolio_theme";

export type ThemeOption = "light" | "dark" | "glassmorphism" | "gradient-blue";

export const themeOptions: { value: ThemeOption; label: string; description: string }[] = [
  { value: "light", label: "Light Theme", description: "Clean and bright" },
  { value: "dark", label: "Dark Theme", description: "Easy on the eyes" },
  { value: "glassmorphism", label: "Glassmorphism Theme", description: "Frosted glass effect" },
  { value: "gradient-blue", label: "Linear Gradient Blue", description: "Modern blue gradient" },
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
  root.classList.remove("dark", "glassmorphism", "gradient-blue");

  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "glassmorphism") {
    root.classList.add("glassmorphism");
  } else if (theme === "gradient-blue") {
    root.classList.add("gradient-blue");
  }
}
