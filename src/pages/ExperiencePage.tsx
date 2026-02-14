import { isAdmin } from "@/lib/auth";
import AnimatedSection from "@/components/AnimatedSection";
import { Briefcase, Pencil, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInlineData, EditInternshipDialog, DeleteButton, AdminActions, AddButton } from "@/components/InlineEdit";

function formatDate(iso?: string) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }
  catch { return ""; }
}

export default function ExperiencePage() {
  const { data: d, save } = useInlineData();
  const admin = isAdmin();

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
                  {(item.startDate || item.endDate || item.singleDate) && (
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.singleDate ? formatDate(item.singleDate) : `${formatDate(item.startDate)} – ${formatDate(item.endDate)}`}
                    </p>
                  )}
                  <h3 className="mt-1 text-lg font-semibold text-card-foreground">{item.role}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{item.organization}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.responsibilities}</p>
                  <AdminActions>
                    <EditInternshipDialog
                      item={item}
                      onSave={(updated) => save((d) => ({ ...d, internships: d.internships.map((x) => x.id === updated.id ? updated : x) }))}
                      trigger={<Button variant="ghost" size="sm" className="gap-1"><Pencil className="h-3 w-3" /> Edit</Button>}
                    />
                    <DeleteButton label="experience" onDelete={() => save((d) => ({ ...d, internships: d.internships.filter((x) => x.id !== item.id) }))} />
                  </AdminActions>
                </div>
              </div>
            </AnimatedSection>
          ))}
          {d.internships.length === 0 && (
            <p className="text-muted-foreground">No experiences added yet.</p>
          )}
        </div>

        <AddButton>
          <EditInternshipDialog
            onSave={(item) => save((d) => ({ ...d, internships: [...d.internships, item] }))}
            trigger={<Button variant="outline" className="gap-1"><Plus className="h-4 w-4" /> Add Experience</Button>}
          />
        </AddButton>
      </div>
    </main>
  );
}
