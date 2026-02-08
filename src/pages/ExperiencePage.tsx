import { getPortfolioData } from "@/lib/portfolioData";
import AnimatedSection from "@/components/AnimatedSection";
import { Briefcase } from "lucide-react";

export default function ExperiencePage() {
  const d = getPortfolioData();

  return (
    <main className="py-16">
      <div className="container max-w-3xl">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-foreground mb-2">Internships & Experience</h1>
          <p className="text-muted-foreground mb-10">Professional training and work</p>
        </AnimatedSection>

        <div className="relative border-l-2 border-border pl-8 ml-4 space-y-10">
          {d.internships.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 150}>
              <div className="relative">
                <div className="absolute -left-[2.55rem] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs text-muted-foreground">{item.duration}</p>
                  <h3 className="mt-1 text-lg font-semibold text-card-foreground">{item.role}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{item.organization}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.responsibilities}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
          {d.internships.length === 0 && (
            <p className="text-muted-foreground">No experiences added yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
