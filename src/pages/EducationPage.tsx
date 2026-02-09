import { isAdmin } from "@/lib/auth";
import AnimatedSection from "@/components/AnimatedSection";
import { GraduationCap, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInlineData, EditEducationDialog, DeleteButton, AdminActions, AddButton } from "@/components/InlineEdit";
import { generateId } from "@/lib/portfolioData";

export default function EducationPage() {
  const { data: d, save } = useInlineData();
  const admin = isAdmin();

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
                  <AdminActions>
                    <EditEducationDialog
                      item={e}
                      onSave={(updated) => save((d) => ({ ...d, education: d.education.map((x) => x.id === updated.id ? updated : x) }))}
                      trigger={<Button variant="ghost" size="sm" className="gap-1"><Pencil className="h-3 w-3" /> Edit</Button>}
                    />
                    <DeleteButton label="education" onDelete={() => save((d) => ({ ...d, education: d.education.filter((x) => x.id !== e.id) }))} />
                  </AdminActions>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AddButton>
          <EditEducationDialog
            onSave={(item) => save((d) => ({ ...d, education: [...d.education, item] }))}
            trigger={<Button variant="outline" className="gap-1"><Plus className="h-4 w-4" /> Add Education</Button>}
          />
        </AddButton>
      </div>
    </main>
  );
}
