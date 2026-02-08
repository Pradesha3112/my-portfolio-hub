import { getPortfolioData } from "@/lib/portfolioData";
import AnimatedSection from "@/components/AnimatedSection";
import SkillBar from "@/components/SkillBar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

const skillLevels: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {
  Python: "Intermediate", HTML: "Advanced", CSS: "Advanced", JavaScript: "Intermediate",
  Git: "Intermediate", GitHub: "Intermediate", Canva: "Advanced", "MS Excel": "Intermediate",
  PowerPoint: "Intermediate", Figma: "Intermediate", WordPress: "Intermediate",
  "Jupyter Notebook": "Intermediate", "Visual Studio Code": "Advanced", "Google Colab": "Intermediate",
};

export default function SkillsPage() {
  const d = getPortfolioData();

  return (
    <main className="py-16">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-foreground mb-2">Skills & Achievements</h1>
          <p className="text-muted-foreground mb-10">My technical abilities and accomplishments</p>
        </AnimatedSection>

        {/* Languages */}
        <AnimatedSection delay={100}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Languages</h2>
          <div className="grid gap-x-12 gap-y-1 md:grid-cols-2 mb-10">
            {d.skills.languages.map((s) => (
              <SkillBar key={s} name={s} level={skillLevels[s] || "Intermediate"} />
            ))}
          </div>
        </AnimatedSection>

        {/* Tools */}
        <AnimatedSection delay={200}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Tools</h2>
          <div className="flex flex-wrap gap-2 mb-10">
            {d.skills.tools.map((t) => (
              <Badge key={t} variant="secondary" className="text-sm py-1.5 px-3">{t}</Badge>
            ))}
          </div>
        </AnimatedSection>

        {/* Platforms */}
        <AnimatedSection delay={300}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Platforms</h2>
          <div className="flex flex-wrap gap-2 mb-10">
            {d.skills.platforms.map((p) => (
              <Badge key={p} variant="outline" className="text-sm py-1.5 px-3">{p}</Badge>
            ))}
          </div>
        </AnimatedSection>

        {/* Other Skills */}
        <AnimatedSection delay={350}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Other Skills</h2>
          <div className="flex flex-wrap gap-2 mb-10">
            {d.skills.other.map((s) => (
              <Badge key={s} variant="secondary" className="text-sm py-1.5 px-3">{s}</Badge>
            ))}
          </div>
        </AnimatedSection>

        {/* Achievements */}
        <AnimatedSection delay={400}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Achievements</h2>
          <div className="space-y-3">
            {d.achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <Trophy className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-card-foreground">{a}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
