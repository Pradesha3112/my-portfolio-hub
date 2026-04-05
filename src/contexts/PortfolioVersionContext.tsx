import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import {
  type PortfolioVersionId,
  type PortfolioVersionMeta,
  getVersionsMeta,
  getActiveVersionId,
  setActiveVersion,
  getVersionData,
  saveVersionData,
  createVersion,
  deleteVersion,
  updateVersionMeta,
  getVersionTheme,
  setVersionTheme,
  getActiveVersionTheme,
} from "@/lib/portfolioVersions";
import type { PortfolioData } from "@/lib/portfolioData";
import { applyTheme, type ThemeOption } from "@/lib/themeManager";

interface VersionContextValue {
  activeVersionId: PortfolioVersionId;
  versions: PortfolioVersionMeta[];
  refreshVersions: () => void;
  setActive: (id: PortfolioVersionId) => void;
  getVersionData: (id: PortfolioVersionId) => PortfolioData;
  saveVersionData: (id: PortfolioVersionId, data: PortfolioData) => void;
  createVersion: (label: string, icon: string, description: string) => PortfolioVersionMeta;
  deleteVersion: (id: PortfolioVersionId) => void;
  updateVersionMeta: (id: PortfolioVersionId, updates: Partial<Pick<PortfolioVersionMeta, "label" | "icon" | "description">>) => void;
  getVersionTheme: (id: PortfolioVersionId) => string | undefined;
  setVersionTheme: (id: PortfolioVersionId, theme: string) => void;
}

const VersionContext = createContext<VersionContextValue | null>(null);

export function PortfolioVersionProvider({ children }: { children: ReactNode }) {
  const [versions, setVersions] = useState<PortfolioVersionMeta[]>(getVersionsMeta);
  const [activeVersionId, setActiveVersionId] = useState<PortfolioVersionId>(getActiveVersionId);

  // Apply active version's theme on mount
  useEffect(() => {
    const theme = getActiveVersionTheme();
    if (theme) {
      applyTheme(theme as ThemeOption);
    }
  }, []);

  const refreshVersions = useCallback(() => {
    setVersions(getVersionsMeta());
    setActiveVersionId(getActiveVersionId());
  }, []);

  const handleSetActive = useCallback((id: PortfolioVersionId) => {
    setActiveVersion(id);
    // Apply the version's theme when setting active
    const theme = getVersionTheme(id);
    if (theme) {
      applyTheme(theme as ThemeOption);
    }
    refreshVersions();
  }, [refreshVersions]);

  const handleCreate = useCallback((label: string, icon: string, description: string) => {
    const v = createVersion(label, icon, description);
    refreshVersions();
    return v;
  }, [refreshVersions]);

  const handleDelete = useCallback((id: PortfolioVersionId) => {
    deleteVersion(id);
    refreshVersions();
  }, [refreshVersions]);

  const handleUpdateMeta = useCallback((id: PortfolioVersionId, updates: Partial<Pick<PortfolioVersionMeta, "label" | "icon" | "description">>) => {
    updateVersionMeta(id, updates);
    refreshVersions();
  }, [refreshVersions]);

  const handleSaveData = useCallback((id: PortfolioVersionId, data: PortfolioData) => {
    saveVersionData(id, data);
    refreshVersions();
  }, [refreshVersions]);

  const handleSetVersionTheme = useCallback((id: PortfolioVersionId, theme: string) => {
    setVersionTheme(id, theme);
    refreshVersions();
  }, [refreshVersions]);

  const handleGetVersionTheme = useCallback((id: PortfolioVersionId) => {
    return getVersionTheme(id);
  }, []);

  return (
    <VersionContext.Provider value={{
      activeVersionId,
      versions,
      refreshVersions,
      setActive: handleSetActive,
      getVersionData,
      saveVersionData: handleSaveData,
      createVersion: handleCreate,
      deleteVersion: handleDelete,
      updateVersionMeta: handleUpdateMeta,
      getVersionTheme: handleGetVersionTheme,
      setVersionTheme: handleSetVersionTheme,
    }}>
      {children}
    </VersionContext.Provider>
  );
}

export function usePortfolioVersion() {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error("usePortfolioVersion must be used within PortfolioVersionProvider");
  return ctx;
}
