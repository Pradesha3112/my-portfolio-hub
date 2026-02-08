import { useState } from "react";
import { getPortfolioData } from "@/lib/portfolioData";
import AnimatedSection from "@/components/AnimatedSection";
import { Input } from "@/components/ui/input";
import { Award, Search } from "lucide-react";

export default function CertificationsPage() {
  const d = getPortfolioData();
  const [search, setSearch] = useState("");

  const filtered = d.certifications.filter(
    (c) => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="py-16">
      <div className="container max-w-3xl">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-foreground mb-2">Certifications</h1>
          <p className="text-muted-foreground mb-6">Courses and certifications I've completed</p>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="relative max-w-sm mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search certifications..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {filtered.map((c, i) => (
            <AnimatedSection key={c.id} delay={i * 100}>
              <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                  <Award className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.platform}</p>
                  {c.date && <p className="text-xs text-muted-foreground mt-1">{c.date}</p>}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </main>
  );
}
