import { useState } from "react";
import { usePortfolioVersion } from "@/contexts/PortfolioVersionContext";
import { type PortfolioVersionId } from "@/lib/portfolioVersions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Layers, Check } from "lucide-react";
import { toast } from "sonner";

export default function VersionSwitcher() {
  const { version, setVersion, versions } = usePortfolioVersion();
  const [transitioning, setTransitioning] = useState(false);
  const current = versions.find((v) => v.id === version)!;

  const handleSwitch = (id: PortfolioVersionId) => {
    if (id === version) return;
    setTransitioning(true);
    // small delay for smooth visual transition
    setTimeout(() => {
      setVersion(id);
      const v = versions.find((x) => x.id === id)!;
      toast.success(`Portfolio switched to ${v.label}`);
      setTransitioning(false);
    }, 150);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 transition-all duration-300 ${transitioning ? "opacity-50 scale-95" : ""}`}
        >
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">{current.icon} {current.label.replace(" Portfolio", "")}</span>
          <span className="sm:hidden">{current.icon}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Change Portfolio Version
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {versions.map((v) => (
          <DropdownMenuItem
            key={v.id}
            onClick={() => handleSwitch(v.id)}
            className="flex items-start gap-3 py-3 cursor-pointer"
          >
            <span className="text-lg mt-0.5">{v.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{v.label}</span>
                {v.id === version && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    <Check className="h-3 w-3 mr-0.5" /> Active
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
