import { useState } from "react";
import { isAdmin } from "@/lib/auth";
import { savePortfolioData, getPortfolioData, type PortfolioData } from "@/lib/portfolioData";
import AnimatedSection from "@/components/AnimatedSection";
import SkillBar from "@/components/SkillBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Pencil, Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

const skillLevels: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {
  Python: "Intermediate", HTML: "Advanced", CSS: "Advanced", JavaScript: "Intermediate",
  Git: "Intermediate", GitHub: "Intermediate", Canva: "Advanced", "MS Excel": "Intermediate",
  PowerPoint: "Intermediate", Figma: "Intermediate", WordPress: "Intermediate",
  "Jupyter Notebook": "Intermediate", "Visual Studio Code": "Advanced", "Google Colab": "Intermediate",
};

export default function SkillsPage() {
  const [revision, setRevision] = useState(0);
  const d = getPortfolioData();
  const admin = isAdmin();
  const [editingSkills, setEditingSkills] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editingAchievement, setEditingAchievement] = useState<number | null>(null);
  const [achievementValue, setAchievementValue] = useState("");

  const save = (updater: (prev: PortfolioData) => PortfolioData) => {
    const current = getPortfolioData();
    const next = updater(current);
    savePortfolioData(next);
    setRevision((r) => r + 1);
  };

  const startEditSkills = (cat: string) => {
    setEditingSkills(cat);
    setEditValue(d.skills[cat as keyof typeof d.skills].join(", "));
  };

  const saveSkills = (cat: string) => {
    const arr = editValue.split(",").map((s) => s.trim()).filter(Boolean);
    save((d) => ({ ...d, skills: { ...d.skills, [cat]: arr } }));
    setEditingSkills(null);
    toast.success("Skills updated");
  };

  const skillCategories = [
    { key: "languages", label: "Languages", showBar: true },
    { key: "tools", label: "Tools", showBar: false },
    { key: "platforms", label: "Platforms", showBar: false },
    { key: "other", label: "Other Skills", showBar: false },
  ] as const;

  return (
    <main className="py-16">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-foreground mb-2">Skills & Achievements</h1>
          <p className="text-muted-foreground mb-10">My technical abilities and accomplishments</p>
        </AnimatedSection>

        {skillCategories.map((cat, ci) => (
          <AnimatedSection key={cat.key} delay={(ci + 1) * 100}>
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-foreground">{cat.label}</h2>
                {admin && editingSkills !== cat.key && (
                  <Button variant="ghost" size="sm" onClick={() => startEditSkills(cat.key)} className="gap-1">
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                )}
              </div>

              {editingSkills === cat.key ? (
                <div className="space-y-2">
                  <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="Comma-separated values" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveSkills(cat.key)} className="gap-1"><Check className="h-3 w-3" /> Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingSkills(null)} className="gap-1"><X className="h-3 w-3" /> Cancel</Button>
                  </div>
                </div>
              ) : cat.showBar ? (
                <div className="grid gap-x-12 gap-y-1 md:grid-cols-2">
                  {d.skills[cat.key].map((s) => (
                    <SkillBar key={s} name={s} level={skillLevels[s] || "Intermediate"} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {d.skills[cat.key].map((s) => (
                    <Badge key={s} variant={cat.key === "platforms" ? "outline" : "secondary"} className="text-sm py-1.5 px-3">{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        ))}

        {/* Achievements */}
        <AnimatedSection delay={500}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Achievements</h2>
          <div className="space-y-3">
            {d.achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <Trophy className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                {editingAchievement === i ? (
                  <div className="flex-1 flex gap-2">
                    <Input value={achievementValue} onChange={(e) => setAchievementValue(e.target.value)} className="flex-1" />
                    <Button size="sm" onClick={() => {
                      save((d) => ({ ...d, achievements: d.achievements.map((x, j) => j === i ? achievementValue : x) }));
                      setEditingAchievement(null);
                      toast.success("Achievement updated");
                    }}><Check className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingAchievement(null)}><X className="h-3 w-3" /></Button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-start justify-between">
                    <p className="text-sm text-card-foreground">{a}</p>
                    {admin && (
                      <div className="flex gap-1 ml-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingAchievement(i); setAchievementValue(a); }}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => {
                          save((d) => ({ ...d, achievements: d.achievements.filter((_, j) => j !== i) }));
                          toast.success("Achievement removed");
                        }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {admin && (
            <Button variant="outline" className="mt-4 gap-1" onClick={() => {
              save((d) => ({ ...d, achievements: [...d.achievements, "New achievement"] }));
              toast.success("Achievement added");
            }}>
              <Plus className="h-4 w-4" /> Add Achievement
            </Button>
          )}
        </AnimatedSection>
      </div>
    </main>
  );
}
