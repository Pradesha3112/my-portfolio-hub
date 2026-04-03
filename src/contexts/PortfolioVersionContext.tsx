import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  type PortfolioVersionId,
  getStoredVersion,
  setStoredVersion,
  PORTFOLIO_VERSIONS,
} from "@/lib/portfolioVersions";

interface VersionContextValue {
  version: PortfolioVersionId;
  setVersion: (id: PortfolioVersionId) => void;
  versions: typeof PORTFOLIO_VERSIONS;
}

const VersionContext = createContext<VersionContextValue | null>(null);

export function PortfolioVersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<PortfolioVersionId>(getStoredVersion);

  const setVersion = useCallback((id: PortfolioVersionId) => {
    setStoredVersion(id);
    setVersionState(id);
  }, []);

  return (
    <VersionContext.Provider value={{ version, setVersion, versions: PORTFOLIO_VERSIONS }}>
      {children}
    </VersionContext.Provider>
  );
}

export function usePortfolioVersion() {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error("usePortfolioVersion must be used within PortfolioVersionProvider");
  return ctx;
}
