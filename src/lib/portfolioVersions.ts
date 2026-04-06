// Portfolio version management — admin-only CMS-style versioning
// Each version stores a complete independent PortfolioData in localStorage
// Public viewers only see the "active" version

import { type PortfolioData, getPortfolioData } from "./portfolioData";

export type PortfolioVersionId = string;

export interface PortfolioVersionMeta {
  id: PortfolioVersionId;
  label: string;
  icon: string;
  description: string;
  isActive: boolean;
  theme?: string; // ThemeOption stored per version
  createdAt: string;
  updatedAt: string;
}

const VERSIONS_META_KEY = "portfolio_versions_meta";
const VERSION_DATA_PREFIX = "portfolio_version_data_";
const ACTIVE_VERSION_KEY = "portfolio_active_version";
const CURRENT_VERSION_KEY = "portfolio_current_version";

function clonePortfolioData(data: PortfolioData): PortfolioData {
  return JSON.parse(JSON.stringify(data)) as PortfolioData;
}

function hydrateVersionData(data: PortfolioData): PortfolioData {
  const baseData = getPortfolioData();
  const hydrated = clonePortfolioData(data);

  if (!hydrated.resumeSelections) {
    hydrated.resumeSelections = clonePortfolioData(baseData).resumeSelections;
  }

  if (!hydrated.resumeSelections?.sectionOrder) {
    hydrated.resumeSelections.sectionOrder = [...baseData.resumeSelections.sectionOrder];
  }

  if (!hydrated.resumeFormatting) {
    hydrated.resumeFormatting = clonePortfolioData(baseData).resumeFormatting;
  }

  return hydrated;
}

// Default version definitions
const DEFAULT_VERSIONS: PortfolioVersionMeta[] = [
  {
    id: "frontend",
    label: "Frontend Portfolio",
    icon: "🎨",
    description: "Focused on web development, UI/UX, and responsive design",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "python",
    label: "Python Portfolio",
    icon: "🐍",
    description: "Focused on Python development, backend, and data science",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ai",
    label: "AI Portfolio",
    icon: "🤖",
    description: "Focused on artificial intelligence, ML, and data science",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ---- Meta (version list) management ----

export function getVersionsMeta(): PortfolioVersionMeta[] {
  const stored = localStorage.getItem(VERSIONS_META_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }
  // Initialize with defaults
  localStorage.setItem(VERSIONS_META_KEY, JSON.stringify(DEFAULT_VERSIONS));
  return DEFAULT_VERSIONS;
}

export function saveVersionsMeta(meta: PortfolioVersionMeta[]) {
  localStorage.setItem(VERSIONS_META_KEY, JSON.stringify(meta));
}

// ---- Active version ----

export function getActiveVersionId(): PortfolioVersionId {
  const meta = getVersionsMeta();
  const active = meta.find((v) => v.isActive);
  return active?.id ?? meta[0]?.id ?? "python";
}

export function setActiveVersion(id: PortfolioVersionId) {
  const meta = getVersionsMeta().map((v) => ({
    ...v,
    isActive: v.id === id,
  }));
  saveVersionsMeta(meta);
}

export function getCurrentVersionId(): PortfolioVersionId {
  const stored = localStorage.getItem(CURRENT_VERSION_KEY);
  const meta = getVersionsMeta();

  if (stored && meta.some((v) => v.id === stored)) {
    return stored;
  }

  const fallbackId = getActiveVersionId();
  localStorage.setItem(CURRENT_VERSION_KEY, fallbackId);
  return fallbackId;
}

export function setCurrentVersion(id: PortfolioVersionId) {
  localStorage.setItem(CURRENT_VERSION_KEY, id);
}

// ---- Per-version data ----

export function getVersionData(id: PortfolioVersionId): PortfolioData {
  const key = VERSION_DATA_PREFIX + id;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return hydrateVersionData(JSON.parse(stored));
    } catch {
      // fall through
    }
  }
  // If no version-specific data, clone base data
  return hydrateVersionData(getPortfolioData());
}

export function saveVersionData(id: PortfolioVersionId, data: PortfolioData) {
  const key = VERSION_DATA_PREFIX + id;
  const nextData = hydrateVersionData(data);
  nextData.lastEdited = new Date().toISOString();
  localStorage.setItem(key, JSON.stringify(nextData));
  // Update meta timestamp
  const meta = getVersionsMeta().map((v) =>
    v.id === id ? { ...v, updatedAt: new Date().toISOString() } : v
  );
  saveVersionsMeta(meta);
}

// ---- Get the public-facing data (active version) ----

export function getActivePortfolioData(): PortfolioData {
  const activeId = getActiveVersionId();
  return getVersionData(activeId);
}

// ---- Get active version's theme ----

export function getActiveVersionTheme(): string | undefined {
  const meta = getVersionsMeta();
  const active = meta.find((v) => v.isActive);
  return active?.theme;
}

export function getVersionTheme(id: PortfolioVersionId): string | undefined {
  const meta = getVersionsMeta();
  const v = meta.find((m) => m.id === id);
  return v?.theme;
}

export function setVersionTheme(id: PortfolioVersionId, theme: string) {
  const meta = getVersionsMeta().map((v) =>
    v.id === id ? { ...v, theme, updatedAt: new Date().toISOString() } : v
  );
  saveVersionsMeta(meta);
}

// ---- CRUD for versions ----

export function createVersion(label: string, icon: string, description: string): PortfolioVersionMeta {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "v-" + Date.now();
  const meta = getVersionsMeta();
  const newVersion: PortfolioVersionMeta = {
    id,
    label,
    icon,
    description,
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  meta.push(newVersion);
  saveVersionsMeta(meta);
  // Initialize with a copy of the currently selected version data
  saveVersionData(id, getVersionData(getCurrentVersionId()));
  return newVersion;
}

export function deleteVersion(id: PortfolioVersionId) {
  const meta = getVersionsMeta().filter((v) => v.id !== id);
  // If deleting active, make first remaining active
  if (!meta.some((v) => v.isActive) && meta.length > 0) {
    meta[0].isActive = true;
  }
  saveVersionsMeta(meta);
  localStorage.removeItem(VERSION_DATA_PREFIX + id);

  if (localStorage.getItem(CURRENT_VERSION_KEY) === id) {
    const fallbackId = meta.find((v) => v.isActive)?.id ?? meta[0]?.id ?? "python";
    localStorage.setItem(CURRENT_VERSION_KEY, fallbackId);
  }
}

export function updateVersionMeta(id: PortfolioVersionId, updates: Partial<Pick<PortfolioVersionMeta, "label" | "icon" | "description">>) {
  const meta = getVersionsMeta().map((v) =>
    v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
  );
  saveVersionsMeta(meta);
}
