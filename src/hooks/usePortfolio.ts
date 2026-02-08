import { useState, useCallback } from "react";
import {
  PortfolioData,
  getPortfolioData,
  savePortfolioData,
  undoChanges,
  resetToDefault,
} from "@/lib/portfolioData";

export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>(getPortfolioData);

  const update = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    setData((prev) => {
      const next = updater(prev);
      savePortfolioData(next);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    const restored = undoChanges();
    setData(restored);
  }, []);

  const reset = useCallback(() => {
    const def = resetToDefault();
    setData(def);
  }, []);

  return { data, update, undo, reset };
}
