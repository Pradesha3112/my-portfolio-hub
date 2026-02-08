import { Link } from "react-router-dom";
import { getPortfolioData } from "@/lib/portfolioData";
import AnimatedSection from "@/components/AnimatedSection";
import SkillBar from "@/components/SkillBar";
import { Mail, Linkedin, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const skillLevels: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {
  Python: "Intermediate",
  HTML: "Advanced",
  CSS: "Advanced",
  JavaScript: "Intermediate",
  Figma: "Intermediate",
  WordPress: "Intermediate",
  Git: "Intermediate",
  Canva: "Advanced",
};

export default function Index() {
  const d = getPortfolioData();
  const featured = d.projects.filter((p) => p.featured).slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent via-background to-secondary opacity-60" />
        <div className="container text-center">
          <AnimatedSection>
            <Badge variant="secondary" className="mb-4 text-sm">
              {d.role}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Hi, I'm <span className="text-primary">{d.name}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {d.intro}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <a href={`mailto:${d.email}`}>
                <Button variant="default" className="gap-2">
                  <Mail className="h-4 w-4" /> Contact Me
                </Button>
              </a>
              <Link to="/projects">
                <Button variant="outline" className="gap-2">
                  View Projects <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <a href={d.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={d.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Skills Summary */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Skills at a Glance</h2>
          </AnimatedSection>
          <div className="grid gap-x-12 gap-y-1 md:grid-cols-2">
            {d.skills.languages.map((s, i) => (
              <AnimatedSection key={s} delay={i * 100}>
                <SkillBar name={s} level={skillLevels[s] || "Intermediate"} />
              </AnimatedSection>
            ))}
            {d.skills.tools.slice(0, 4).map((s, i) => (
              <AnimatedSection key={s} delay={(i + d.skills.languages.length) * 100}>
                <SkillBar name={s} level={skillLevels[s] || "Intermediate"} />
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/skills">
              <Button variant="ghost" className="gap-1">
                See All Skills <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Projects</h2>
            </AnimatedSection>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 150}>
                  <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-card-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground flex-1">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.techStack.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
