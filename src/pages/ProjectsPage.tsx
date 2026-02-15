import { useState } from "react";
import { isAdmin } from "@/lib/auth";
import AnimatedSection from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Search, Pencil, Plus, Play, Calendar, FileDown } from "lucide-react";
import { useInlineData, EditProjectDialog, DeleteButton, AdminActions, AddButton } from "@/components/InlineEdit";
import { generateProjectPDF } from "@/lib/resumeGenerator";
import { toast } from "sonner";

function formatDate(iso?: string) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }
  catch { return ""; }
}

export default function ProjectsPage() {
  const { data: d, save } = useInlineData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const admin = isAdmin();

  const allTech = [...new Set(d.projects.flatMap((p) => p.techStack))];

  const filtered = d.projects.filter((p) => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || p.techStack.includes(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="py-16">
      <div className="container">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground mb-6">Things I've built</p>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search projects..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={filter === null ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter(null)}>All</Badge>
              {allTech.map((t) => (
                <Badge key={t} variant={filter === t ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter(t === filter ? null : t)}>{t}</Badge>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <AnimatedSection key={p.id} delay={i * 100}>
              <div className="rounded-lg border border-border bg-card hover:shadow-md transition-shadow h-full flex flex-col overflow-hidden">
                {/* Thumbnail or first image */}
                {(p.thumbnail || (p.images && p.images.length > 0)) && (
                  <div className="w-full h-40 overflow-hidden">
                    <img src={p.thumbnail || p.images![0]} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-card-foreground">{p.title}</h3>
                    {p.featured && <Star className="h-4 w-4 text-primary fill-primary flex-shrink-0" />}
                  </div>

                  {/* Dates */}
                  {(p.startDate || p.endDate || p.singleDate) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {p.singleDate ? formatDate(p.singleDate) : `${formatDate(p.startDate)} – ${formatDate(p.endDate)}`}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-muted-foreground flex-1">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.techStack.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        View Project <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {p.demoUrl && (
                      <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        <Play className="h-3 w-3" /> Live Demo
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={async () => {
                        try { await generateProjectPDF(p.id); toast.success("Project PDF downloaded!"); }
                        catch { toast.error("Failed to generate PDF"); }
                      }}
                    >
                      <FileDown className="h-3 w-3" /> Download PDF
                    </Button>
                  </div>

                  {/* Demo video embed */}
                  {p.demoVideoUrl && (
                    <div className="mt-3 rounded-md overflow-hidden border border-border aspect-video">
                      <iframe src={p.demoVideoUrl} title={`${p.title} demo`} className="w-full h-full" allowFullScreen />
                    </div>
                  )}

                  <AdminActions>
                    <EditProjectDialog
                      item={p}
                      onSave={(updated) => save((d) => ({ ...d, projects: d.projects.map((x) => x.id === updated.id ? updated : x) }))}
                      trigger={<Button variant="ghost" size="sm" className="gap-1"><Pencil className="h-3 w-3" /> Edit</Button>}
                    />
                    <DeleteButton label="project" onDelete={() => save((d) => ({ ...d, projects: d.projects.filter((x) => x.id !== p.id) }))} />
                  </AdminActions>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground mt-8">No projects found.</p>}

        <AddButton>
          <EditProjectDialog
            onSave={(item) => save((d) => ({ ...d, projects: [...d.projects, item] }))}
            trigger={<Button variant="outline" className="gap-1"><Plus className="h-4 w-4" /> Add Project</Button>}
          />
        </AddButton>
      </div>
    </main>
  );
}
