import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyTheme, getSavedTheme } from "./lib/themeManager";

// Apply persisted theme on load
applyTheme(getSavedTheme());

createRoot(document.getElementById("root")!).render(<App />);
