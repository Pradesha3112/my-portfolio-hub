import { getPortfolioData } from "@/lib/portfolioData";
import AnimatedSection from "@/components/AnimatedSection";
import { GraduationCap } from "lucide-react";

export default function EducationPage() {
  const d = getPortfolioData();

  return (
    <main className="py-16">
      <div className="container max-w-3xl">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-foreground mb-2">Education & Schooling</h1>
          <p className="text-muted-foreground mb-10">My academic journey</p>
        </AnimatedSection>

        <div className="relative border-l-2 border-border pl-8 ml-4 space-y-10">
          {d.education.map((e, i) => (
            <AnimatedSection key={e.id} delay={i * 150}>
              <div className="relative">
                <div className="absolute -left-[2.55rem] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs text-muted-foreground">{e.duration}</p>
                  <h3 className="mt-1 text-lg font-semibold text-card-foreground">{e.institution}</h3>
                  <p className="text-sm text-muted-foreground">{e.course}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{e.score}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </main>
  );
}
