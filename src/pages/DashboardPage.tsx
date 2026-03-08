import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, logout } from "@/lib/auth";
import { usePortfolio } from "@/hooks/usePortfolio";
import { generateId, getResumeItems, type Education, type Internship, type Project, type Certification, DEFAULT_SECTION_ORDER, type ResumeSectionId } from "@/lib/portfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Trash2, Plus, Undo2, RotateCcw, Save, Palette, Check, Calendar as CalendarIcon, Image, Video, Eye, FileText, AlertTriangle } from "lucide-react";
import { themeOptions, getSavedTheme, saveTheme, type ThemeOption } from "@/lib/themeManager";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { generateResume } from "@/lib/resumeGenerator";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, update, undo, reset } = usePortfolio();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(getSavedTheme());
  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    if (!isAdmin()) navigate("/login");
  }, [navigate]);

  if (!isAdmin()) return null;

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "education", label: "Education" },
    { id: "internships", label: "Internships" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "skills", label: "Skills" },
    { id: "achievements", label: "Achievements" },
    { id: "resume", label: "📄 Resume" },
    { id: "theme", label: "🎨 Theme" },
  ];

  const handleSaveTheme = () => {
    saveTheme(selectedTheme);
    toast.success(`Theme saved: ${themeOptions.find(t => t.value === selectedTheme)?.label}`);
  };

  const handleReset = () => {
    reset();
    setShowResetDialog(false);
    toast.info("Reset to default");
  };

  const resumeItems = getResumeItems(data);

  return (
    <main className="py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")} className="gap-1">
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button variant="outline" size="sm" onClick={() => { undo(); toast.info("Changes undone"); }} className="gap-1">
              <Undo2 className="h-4 w-4" /> Undo
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)} className="gap-1">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { logout(); navigate("/"); }} className="gap-1">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Reset confirmation dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Confirm Reset</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">This will reset all portfolio data to defaults. This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReset}>Reset Everything</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <p className="text-xs text-muted-foreground mb-6">Last edited: {new Date(data.lastEdited).toLocaleString()}</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {tabs.map((t) => (
            <Button key={t.id} variant={activeTab === t.id ? "default" : "ghost"} size="sm" onClick={() => setActiveTab(t.id)}>
              {t.label}
            </Button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="max-w-lg space-y-4">
            <div><Label>Name</Label><Input value={data.name} onChange={(e) => update((d) => ({ ...d, name: e.target.value }))} /></div>
            <div><Label>Role</Label><Input value={data.role} onChange={(e) => update((d) => ({ ...d, role: e.target.value }))} /></div>
            <div><Label>Introduction</Label><Textarea value={data.intro} onChange={(e) => update((d) => ({ ...d, intro: e.target.value }))} rows={4} /></div>
            <div><Label>Email</Label><Input value={data.email} onChange={(e) => update((d) => ({ ...d, email: e.target.value }))} /></div>
            <div><Label>LinkedIn</Label><Input value={data.linkedin} onChange={(e) => update((d) => ({ ...d, linkedin: e.target.value }))} /></div>
            <div><Label>GitHub</Label><Input value={data.github} onChange={(e) => update((d) => ({ ...d, github: e.target.value }))} /></div>
            <Button onClick={() => toast.success("Profile saved!")} className="gap-1"><Save className="h-4 w-4" /> Save Profile</Button>
          </div>
        )}

        {/* Education */}
        {activeTab === "education" && (
          <div>
            <SectionEditor<Education>
              items={data.education}
              onUpdate={(items) => update((d) => ({ ...d, education: items }))}
              fields={[
                { key: "institution", label: "Institution" },
                { key: "course", label: "Course / Degree" },
                { key: "duration", label: "Duration" },
                { key: "score", label: "Score (GPA / %)" },
              ]}
              createNew={() => ({ id: generateId(), institution: "", course: "", duration: "", score: "" })}
            />
            <Button onClick={() => toast.success("Education saved!")} className="gap-1 mt-4"><Save className="h-4 w-4" /> Save Education</Button>
          </div>
        )}

        {/* Internships */}
        {activeTab === "internships" && (
          <div>
            <InternshipEditor items={data.internships} onUpdate={(items) => update((d) => ({ ...d, internships: items }))} />
            <Button onClick={() => toast.success("Internships saved!")} className="gap-1 mt-4"><Save className="h-4 w-4" /> Save Internships</Button>
          </div>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div>
            <ProjectEditor items={data.projects} onUpdate={(items) => update((d) => ({ ...d, projects: items }))} />
            <Button onClick={() => toast.success("Projects saved!")} className="gap-1 mt-4"><Save className="h-4 w-4" /> Save Projects</Button>
          </div>
        )}

        {/* Certifications */}
        {activeTab === "certifications" && (
          <div>
            <CertificationEditor items={data.certifications} onUpdate={(items) => update((d) => ({ ...d, certifications: items }))} />
            <Button onClick={() => toast.success("Certifications saved!")} className="gap-1 mt-4"><Save className="h-4 w-4" /> Save Certifications</Button>
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          <div className="max-w-lg space-y-6">
            {(["languages", "tools", "platforms", "other"] as const).map((cat) => (
              <div key={cat}>
                <Label className="capitalize mb-2 block">{cat}</Label>
                <Input
                  value={data.skills[cat].join(", ")}
                  onChange={(e) => {
                    const arr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    update((d) => ({ ...d, skills: { ...d.skills, [cat]: arr } }));
                  }}
                  placeholder="Comma-separated values"
                />
              </div>
            ))}
            <div className="border-t border-border pt-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Skill Proficiency Levels</h3>
              <p className="text-sm text-muted-foreground mb-4">Set proficiency for each skill (shown on portfolio & resume)</p>
              <div className="space-y-2">
                {Object.values(data.skills).flat().map((skill) => (
                  <div key={skill} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-40 truncate">{skill}</span>
                    <Select
                      value={data.skillLevels?.[skill] || "Intermediate"}
                      onValueChange={(v) =>
                        update((d) => ({
                          ...d,
                          skillLevels: { ...d.skillLevels, [skill]: v as "Beginner" | "Intermediate" | "Advanced" },
                        }))
                      }
                    >
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={() => toast.success("Skills saved!")} className="gap-1"><Save className="h-4 w-4" /> Save Skills</Button>
          </div>
        )}

        {/* Achievements */}
        {activeTab === "achievements" && (
          <div className="max-w-lg space-y-4">
            {data.achievements.map((a, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={a}
                  onChange={(e) => {
                    const arr = [...data.achievements];
                    arr[i] = e.target.value;
                    update((d) => ({ ...d, achievements: arr }));
                  }}
                />
                <Button variant="ghost" size="icon" onClick={() => {
                  update((d) => ({ ...d, achievements: d.achievements.filter((_, j) => j !== i) }));
                  toast.success("Achievement removed");
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => update((d) => ({ ...d, achievements: [...d.achievements, ""] }))} className="gap-1">
              <Plus className="h-4 w-4" /> Add Achievement
            </Button>
            <Button onClick={() => toast.success("Achievements saved!")} className="gap-1 mt-2"><Save className="h-4 w-4" /> Save Achievements</Button>
          </div>
        )}

        {/* Resume Review */}
        {activeTab === "resume" && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <FileText className="h-5 w-5" /> Resume Builder
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Select items for your single-page resume. Unselected = auto-pick top items.</p>
            </div>

            {/* Skill Categories */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-card-foreground mb-3">Skill Categories</h3>
              <div className="flex flex-wrap gap-4">
                {(["languages", "tools", "platforms", "other"] as const).map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-foreground capitalize">
                    <Checkbox
                      checked={data.resumeSelections.selectedSkillCategories.includes(cat)}
                      onCheckedChange={(checked) => {
                        update((d) => {
                          const current = d.resumeSelections.selectedSkillCategories;
                          const next = checked ? [...current, cat] : current.filter((c) => c !== cat);
                          return { ...d, resumeSelections: { ...d.resumeSelections, selectedSkillCategories: next } };
                        });
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Projects (max 3) */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-card-foreground mb-1">Projects <span className="text-xs text-muted-foreground font-normal">(max 3)</span></h3>
              <p className="text-xs text-muted-foreground mb-3">If none selected, top featured/recent are auto-picked.</p>
              <div className="space-y-2">
                {data.projects.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox
                      checked={data.resumeSelections.selectedProjects.includes(p.id)}
                      disabled={!data.resumeSelections.selectedProjects.includes(p.id) && data.resumeSelections.selectedProjects.length >= 3}
                      onCheckedChange={(checked) => {
                        update((d) => {
                          const current = d.resumeSelections.selectedProjects;
                          const next = checked ? [...current, p.id] : current.filter((id) => id !== p.id);
                          return { ...d, resumeSelections: { ...d.resumeSelections, selectedProjects: next } };
                        });
                      }}
                    />
                    {p.title} {p.featured && "★"}
                  </label>
                ))}
              </div>
            </div>

            {/* Internships (max 2) */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-card-foreground mb-1">Internships / Training <span className="text-xs text-muted-foreground font-normal">(max 2)</span></h3>
              <div className="space-y-2">
                {data.internships.map((i) => (
                  <label key={i.id} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox
                      checked={data.resumeSelections.selectedInternships.includes(i.id)}
                      disabled={!data.resumeSelections.selectedInternships.includes(i.id) && data.resumeSelections.selectedInternships.length >= 2}
                      onCheckedChange={(checked) => {
                        update((d) => {
                          const current = d.resumeSelections.selectedInternships;
                          const next = checked ? [...current, i.id] : current.filter((id) => id !== i.id);
                          return { ...d, resumeSelections: { ...d.resumeSelections, selectedInternships: next } };
                        });
                      }}
                    />
                    {i.role} — {i.organization}
                  </label>
                ))}
              </div>
            </div>

            {/* Certifications (max 4) */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-card-foreground mb-1">Certificates <span className="text-xs text-muted-foreground font-normal">(max 4)</span></h3>
              <div className="space-y-2">
                {data.certifications.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox
                      checked={data.resumeSelections.selectedCertifications.includes(c.id)}
                      disabled={!data.resumeSelections.selectedCertifications.includes(c.id) && data.resumeSelections.selectedCertifications.length >= 4}
                      onCheckedChange={(checked) => {
                        update((d) => {
                          const current = d.resumeSelections.selectedCertifications;
                          const next = checked ? [...current, c.id] : current.filter((id) => id !== c.id);
                          return { ...d, resumeSelections: { ...d.resumeSelections, selectedCertifications: next } };
                        });
                      }}
                    />
                    {c.title} — {c.platform}
                  </label>
                ))}
              </div>
            </div>

            {/* Preview summary */}
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-5">
              <h3 className="font-semibold text-foreground mb-3">Resume Preview Summary</h3>
              <div className="grid gap-3 sm:grid-cols-2 text-sm text-foreground">
                <div>
                  <p className="font-medium">Projects ({resumeItems.projects.length}/3):</p>
                  <ul className="ml-4 text-muted-foreground">
                    {resumeItems.projects.map((p) => <li key={p.id}>• {p.title}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Internships ({resumeItems.internships.length}/2):</p>
                  <ul className="ml-4 text-muted-foreground">
                    {resumeItems.internships.map((i) => <li key={i.id}>• {i.role}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Certificates ({resumeItems.certifications.length}/4):</p>
                  <ul className="ml-4 text-muted-foreground">
                    {resumeItems.certifications.map((c) => <li key={c.id}>• {c.title}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Skill Categories:</p>
                  <p className="ml-4 text-muted-foreground capitalize">{resumeItems.skillCategories.join(", ")}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => { toast.success("Resume selections saved!"); }} className="gap-1">
                <Save className="h-4 w-4" /> Save Selections
              </Button>
              <Button variant="outline" onClick={async () => {
                try { await generateResume(); toast.success("Resume downloaded!"); }
                catch { toast.error("Failed to generate resume"); }
              }} className="gap-1">
                <FileText className="h-4 w-4" /> Download Resume
              </Button>
            </div>
          </div>
        )}

        {/* Theme Settings */}
        {activeTab === "theme" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <Palette className="h-5 w-5" /> Theme Settings
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Select a theme for your portfolio. Applied globally and persists across sessions.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {themeOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedTheme(t.value)}
                  className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${
                    selectedTheme === t.value
                      ? "border-primary bg-primary/10 ring-2 ring-primary"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${t.preview}`}>
                    {selectedTheme === t.value && <Check className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button onClick={handleSaveTheme} className="gap-1">
              <Save className="h-4 w-4" /> Save Theme
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

// Date picker helper
function DatePickerField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  const date = value ? new Date(value) : undefined;
  return (
    <div>
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onChange(d.toISOString())}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {value && (
        <Button variant="ghost" size="sm" className="mt-1 text-xs text-muted-foreground" onClick={() => onChange("")}>
          Clear date
        </Button>
      )}
    </div>
  );
}

// Generic section editor
interface Field { key: string; label: string; multiline?: boolean; }

function SectionEditor<T extends { id: string }>({
  items, onUpdate, fields, createNew,
}: {
  items: T[]; onUpdate: (items: T[]) => void; fields: Field[]; createNew: () => T;
}) {
  const handleChange = (index: number, key: string, value: string) => {
    const arr = [...items];
    (arr[index] as Record<string, unknown>)[key] = value;
    onUpdate(arr);
  };

  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={item.id} className="rounded-lg border border-border bg-card p-5 space-y-3">
          {fields.map((f) => (
            <div key={f.key}>
              <Label>{f.label}</Label>
              {f.multiline ? (
                <Textarea value={String((item as Record<string, unknown>)[f.key] || "")} onChange={(e) => handleChange(i, f.key, e.target.value)} rows={3} />
              ) : (
                <Input value={String((item as Record<string, unknown>)[f.key] || "")} onChange={(e) => handleChange(i, f.key, e.target.value)} />
              )}
            </div>
          ))}
          <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => {
            onUpdate(items.filter((_, j) => j !== i));
            toast.success("Item removed");
          }}>
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={() => { onUpdate([...items, createNew()]); toast.success("Item added"); }} className="gap-1">
        <Plus className="h-4 w-4" /> Add New
      </Button>
    </div>
  );
}

// Internship editor with date pickers and thumbnail
function InternshipEditor({ items, onUpdate }: { items: Internship[]; onUpdate: (items: Internship[]) => void }) {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const handleChange = (index: number, key: string, value: unknown) => {
    const arr = [...items];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arr[index] as any)[key] = value;
    onUpdate(arr);
  };

  return (
    <div className="space-y-6">
      <Dialog open={deleteIdx !== null} onOpenChange={(o) => !o && setDeleteIdx(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete experience?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIdx(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onUpdate(items.filter((_, j) => j !== deleteIdx)); setDeleteIdx(null); toast.success("Experience removed"); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {items.map((item, i) => (
        <div key={item.id} className="rounded-lg border border-border bg-card p-5 space-y-3">
          <div><Label>Role</Label><Input value={item.role} onChange={(e) => handleChange(i, "role", e.target.value)} /></div>
          <div><Label>Organization</Label><Input value={item.organization} onChange={(e) => handleChange(i, "organization", e.target.value)} /></div>
          <div><Label>Duration (text)</Label><Input value={item.duration} onChange={(e) => handleChange(i, "duration", e.target.value)} /></div>
          <div><Label>Responsibilities</Label><Textarea value={item.responsibilities} onChange={(e) => handleChange(i, "responsibilities", e.target.value)} rows={3} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DatePickerField label="Start Date" value={item.startDate} onChange={(v) => handleChange(i, "startDate", v)} />
            <DatePickerField label="End Date" value={item.endDate} onChange={(v) => handleChange(i, "endDate", v)} />
            <DatePickerField label="Single Date" value={item.singleDate} onChange={(v) => handleChange(i, "singleDate", v)} />
          </div>
          <div>
            <Label className="flex items-center gap-1"><Image className="h-3 w-3" /> Thumbnail URL</Label>
            <Input value={item.thumbnail || ""} onChange={(e) => handleChange(i, "thumbnail", e.target.value)} placeholder="https://image-url.png" />
            {item.thumbnail && <img src={item.thumbnail} alt="thumb" className="mt-2 h-20 rounded-md border border-border object-cover" />}
          </div>
          <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => setDeleteIdx(i)}>
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={() => {
        onUpdate([...items, { id: generateId(), role: "", organization: "", duration: "", responsibilities: "" }]);
        toast.success("Experience added");
      }} className="gap-1">
        <Plus className="h-4 w-4" /> Add Experience
      </Button>
    </div>
  );
}

// Project editor with all report fields
function ProjectEditor({ items, onUpdate }: { items: Project[]; onUpdate: (items: Project[]) => void }) {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const handleChange = (index: number, key: string, value: unknown) => {
    const arr = [...items];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arr[index] as any)[key] = value;
    onUpdate(arr);
  };

  const motivationOptions: Array<{ value: string; label: string }> = [
    { value: "College/Work", label: "College / Work" },
    { value: "Personal Interest", label: "Personal Interest" },
    { value: "Hackathon", label: "Hackathon" },
    { value: "Technical Event", label: "Technical Event" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      {/* Delete confirmation */}
      <Dialog open={deleteIdx !== null} onOpenChange={(o) => !o && setDeleteIdx(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete project?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this project? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIdx(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onUpdate(items.filter((_, j) => j !== deleteIdx)); setDeleteIdx(null); toast.success("Project removed"); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {items.map((p, i) => (
        <div key={p.id} className="rounded-lg border border-border bg-card p-5 space-y-3">
          <div><Label>Title</Label><Input value={p.title} onChange={(e) => handleChange(i, "title", e.target.value)} /></div>
          <div><Label>Description</Label><Textarea value={p.description} onChange={(e) => handleChange(i, "description", e.target.value)} rows={3} /></div>
          <div><Label>Key Features (comma-separated)</Label><Input value={(p.keyFeatures || []).join(", ")} onChange={(e) => handleChange(i, "keyFeatures", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Feature 1, Feature 2" /></div>
          <div><Label>Tech Stack (comma-separated)</Label><Input value={p.techStack.join(", ")} onChange={(e) => handleChange(i, "techStack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></div>
          <div><Label>Skills You May Learn (comma-separated)</Label><Input value={(p.skillsToLearn || []).join(", ")} onChange={(e) => handleChange(i, "skillsToLearn", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="React, API Design" /></div>
          <div><Label>Project Link</Label><Input value={p.link} onChange={(e) => handleChange(i, "link", e.target.value)} /></div>
          <div><Label>GitHub Link</Label><Input value={p.githubLink || ""} onChange={(e) => handleChange(i, "githubLink", e.target.value)} placeholder="https://github.com/..." /></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Motivation</Label>
              <Select value={p.motivation || ""} onValueChange={(v) => handleChange(i, "motivation", v)}>
                <SelectTrigger><SelectValue placeholder="Select motivation" /></SelectTrigger>
                <SelectContent>
                  {motivationOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {p.motivation === "Other" && (
              <div>
                <Label>Specify</Label>
                <Input value={p.motivationOther || ""} onChange={(e) => handleChange(i, "motivationOther", e.target.value)} placeholder="Your reason..." />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={p.featured} onCheckedChange={(v) => handleChange(i, "featured", v)} />
            <Label>Featured</Label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DatePickerField label="Start Date" value={p.startDate} onChange={(v) => handleChange(i, "startDate", v)} />
            <DatePickerField label="End Date" value={p.endDate} onChange={(v) => handleChange(i, "endDate", v)} />
            <DatePickerField label="Single Date" value={p.singleDate} onChange={(v) => handleChange(i, "singleDate", v)} />
          </div>
          <div>
            <Label className="flex items-center gap-1"><Image className="h-3 w-3" /> Thumbnail URL</Label>
            <Input value={p.thumbnail || ""} onChange={(e) => handleChange(i, "thumbnail", e.target.value)} placeholder="https://project-screenshot.png" />
            {p.thumbnail && <img src={p.thumbnail} alt="thumb" className="mt-2 h-24 rounded-md border border-border object-cover" />}
          </div>
          <div className="border-t border-border pt-3 space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1"><Video className="h-4 w-4" /> Demo & Media</h4>
            <div><Label>Live Demo / Try Out URL</Label><Input value={p.demoUrl || ""} onChange={(e) => handleChange(i, "demoUrl", e.target.value)} placeholder="https://your-demo.github.io" /></div>
            <div><Label>Demo Video URL</Label><Input value={p.demoVideoUrl || ""} onChange={(e) => handleChange(i, "demoVideoUrl", e.target.value)} placeholder="https://youtube.com/embed/..." /></div>
            <div><Label>Screenshot URLs (comma-separated)</Label><Input value={(p.screenshots || []).join(", ")} onChange={(e) => handleChange(i, "screenshots", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="https://screenshot1.png, https://screenshot2.png" /></div>
            <div><Label>Additional Image URLs (comma-separated)</Label><Input value={(p.images || []).join(", ")} onChange={(e) => handleChange(i, "images", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="https://img1.png, https://img2.png" /></div>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => setDeleteIdx(i)}>
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={() => {
        onUpdate([...items, { id: generateId(), title: "", description: "", techStack: [], link: "", featured: false }]);
        toast.success("Project added");
      }} className="gap-1">
        <Plus className="h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}

// Certification editor with certificate URL and thumbnail
function CertificationEditor({ items, onUpdate }: { items: Certification[]; onUpdate: (items: Certification[]) => void }) {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const handleChange = (index: number, key: string, value: string) => {
    const arr = [...items];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arr[index] as any)[key] = value;
    onUpdate(arr);
  };

  return (
    <div className="space-y-6">
      <Dialog open={deleteIdx !== null} onOpenChange={(o) => !o && setDeleteIdx(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete certification?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIdx(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onUpdate(items.filter((_, j) => j !== deleteIdx)); setDeleteIdx(null); toast.success("Certification removed"); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {items.map((c, i) => (
        <div key={c.id} className="rounded-lg border border-border bg-card p-5 space-y-3">
          <div><Label>Title</Label><Input value={c.title} onChange={(e) => handleChange(i, "title", e.target.value)} /></div>
          <div><Label>Platform</Label><Input value={c.platform} onChange={(e) => handleChange(i, "platform", e.target.value)} /></div>
          <div><Label>Date</Label><Input value={c.date} onChange={(e) => handleChange(i, "date", e.target.value)} /></div>
          <div>
            <Label className="flex items-center gap-1"><Image className="h-3 w-3" /> Certificate Image/URL</Label>
            <Input value={c.certificateUrl || ""} onChange={(e) => handleChange(i, "certificateUrl", e.target.value)} placeholder="https://certificate-image.png" />
          </div>
          <div>
            <Label className="flex items-center gap-1"><Image className="h-3 w-3" /> Thumbnail URL</Label>
            <Input value={c.thumbnail || ""} onChange={(e) => handleChange(i, "thumbnail", e.target.value)} placeholder="https://thumbnail.png" />
          </div>
          {(c.certificateUrl || c.thumbnail) && (
            <div className="rounded-md overflow-hidden border border-border">
              <img src={c.thumbnail || c.certificateUrl} alt={c.title} className="w-full h-32 object-cover" />
            </div>
          )}
          <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => setDeleteIdx(i)}>
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={() => {
        onUpdate([...items, { id: generateId(), title: "", platform: "", date: "" }]);
        toast.success("Certification added");
      }} className="gap-1">
        <Plus className="h-4 w-4" /> Add Certification
      </Button>
    </div>
  );
}
