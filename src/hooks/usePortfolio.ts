import { useCallback, useEffect, useRef, useState } from "react";
import {
  resetToDefault,
  type PortfolioData,
} from "@/lib/portfolioData";
import { usePortfolioVersion } from "@/contexts/PortfolioVersionContext";

export function usePortfolio() {
  const { currentVersionId, getVersionData, saveVersionData } = usePortfolioVersion();
  const historyRef = useRef<Record<string, PortfolioData>>({});
  const [data, setData] = useState<PortfolioData>(() => getVersionData(currentVersionId));

  useEffect(() => {
    setData(getVersionData(currentVersionId));
  }, [currentVersionId, getVersionData]);

  const update = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    setData((prev) => {
      const next = updater(prev);
      historyRef.current[currentVersionId] = JSON.parse(JSON.stringify(prev)) as PortfolioData;
      saveVersionData(currentVersionId, next);
      return next;
    });
  }, [currentVersionId, saveVersionData]);

  const undo = useCallback(() => {
    const restored = historyRef.current[currentVersionId];
    if (!restored) return;

    saveVersionData(currentVersionId, restored);
    setData(restored);
    delete historyRef.current[currentVersionId];
  }, [currentVersionId, saveVersionData]);

  const reset = useCallback(() => {
    const def = resetToDefault();
    saveVersionData(currentVersionId, def);
    setData(def);
  }, [currentVersionId, saveVersionData]);

  return { data, update, undo, reset };
}
