import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
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
} from "@/lib/portfolioVersions";
import type { PortfolioData } from "@/lib/portfolioData";

interface VersionContextValue {
  // For public: the active version's data
  activeVersionId: PortfolioVersionId;
  // For admin: full version management
  versions: PortfolioVersionMeta[];
  refreshVersions: () => void;
  setActive: (id: PortfolioVersionId) => void;
  getVersionData: (id: PortfolioVersionId) => PortfolioData;
  saveVersionData: (id: PortfolioVersionId, data: PortfolioData) => void;
  createVersion: (label: string, icon: string, description: string) => PortfolioVersionMeta;
  deleteVersion: (id: PortfolioVersionId) => void;
  updateVersionMeta: (id: PortfolioVersionId, updates: Partial<Pick<PortfolioVersionMeta, "label" | "icon" | "description">>) => void;
}

const VersionContext = createContext<VersionContextValue | null>(null);

export function PortfolioVersionProvider({ children }: { children: ReactNode }) {
  const [versions, setVersions] = useState<PortfolioVersionMeta[]>(getVersionsMeta);
  const [activeVersionId, setActiveVersionId] = useState<PortfolioVersionId>(getActiveVersionId);

  const refreshVersions = useCallback(() => {
    setVersions(getVersionsMeta());
    setActiveVersionId(getActiveVersionId());
  }, []);

  const handleSetActive = useCallback((id: PortfolioVersionId) => {
    setActiveVersion(id);
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
