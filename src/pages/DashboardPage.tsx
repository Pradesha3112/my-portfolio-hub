import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, logout } from "@/lib/auth";
import { usePortfolio } from "@/hooks/usePortfolio";
import { generateId, type Education, type Internship, type Project, type Certification } from "@/lib/portfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, Trash2, Plus, Undo2, RotateCcw, Save, Palette, Check, Calendar as CalendarIcon, Image, Video, ExternalLink } from "lucide-react";
import { themeOptions, getSavedTheme, saveTheme, type ThemeOption } from "@/lib/themeManager";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, update, undo, reset } = usePortfolio();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(getSavedTheme());

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
    { id: "theme", label: "🎨 Theme" },
  ];

  const handleSaveTheme = () => {
    saveTheme(selectedTheme);
    toast.success(`Theme saved: ${themeOptions.find(t => t.value === selectedTheme)?.label}`);
  };

  return (
    <main className="py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { undo(); toast.info("Changes undone"); }} className="gap-1">
              <Undo2 className="h-4 w-4" /> Undo
            </Button>
            <Button variant="outline" size="sm" onClick={() => { reset(); toast.info("Reset to default"); }} className="gap-1">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { logout(); navigate("/"); }} className="gap-1">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

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
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
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
            className={cn("p-3 pointer-events-auto")}
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

// Internship editor with date pickers
function InternshipEditor({ items, onUpdate }: { items: Internship[]; onUpdate: (items: Internship[]) => void }) {
  const handleChange = (index: number, key: string, value: unknown) => {
    const arr = [...items];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arr[index] as any)[key] = value;
    onUpdate(arr);
  };

  return (
    <div className="space-y-6">
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
          <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => {
            onUpdate(items.filter((_, j) => j !== i));
            toast.success("Experience removed");
          }}>
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

// Project editor with date pickers, demo URL, video URL, images
function ProjectEditor({ items, onUpdate }: { items: Project[]; onUpdate: (items: Project[]) => void }) {
  const handleChange = (index: number, key: string, value: unknown) => {
    const arr = [...items];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arr[index] as any)[key] = value;
    onUpdate(arr);
  };

  return (
    <div className="space-y-6">
      {items.map((p, i) => (
        <div key={p.id} className="rounded-lg border border-border bg-card p-5 space-y-3">
          <div><Label>Title</Label><Input value={p.title} onChange={(e) => handleChange(i, "title", e.target.value)} /></div>
          <div><Label>Description</Label><Textarea value={p.description} onChange={(e) => handleChange(i, "description", e.target.value)} rows={3} /></div>
          <div><Label>Tech Stack (comma-separated)</Label><Input value={p.techStack.join(", ")} onChange={(e) => handleChange(i, "techStack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></div>
          <div><Label>Link</Label><Input value={p.link} onChange={(e) => handleChange(i, "link", e.target.value)} /></div>
          <div className="flex items-center gap-2">
            <Switch checked={p.featured} onCheckedChange={(v) => handleChange(i, "featured", v)} />
            <Label>Featured</Label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DatePickerField label="Start Date" value={p.startDate} onChange={(v) => handleChange(i, "startDate", v)} />
            <DatePickerField label="End Date" value={p.endDate} onChange={(v) => handleChange(i, "endDate", v)} />
            <DatePickerField label="Single Date" value={p.singleDate} onChange={(v) => handleChange(i, "singleDate", v)} />
          </div>
          <div className="border-t border-border pt-3 space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1"><Video className="h-4 w-4" /> Demo & Media</h4>
            <div><Label>Live Demo URL (iframe)</Label><Input value={p.demoUrl || ""} onChange={(e) => handleChange(i, "demoUrl", e.target.value)} placeholder="https://your-demo.github.io" /></div>
            <div><Label>Demo Video URL</Label><Input value={p.demoVideoUrl || ""} onChange={(e) => handleChange(i, "demoVideoUrl", e.target.value)} placeholder="https://youtube.com/embed/..." /></div>
            <div><Label>Image URLs (comma-separated)</Label><Input value={(p.images || []).join(", ")} onChange={(e) => handleChange(i, "images", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="https://img1.png, https://img2.png" /></div>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => {
            onUpdate(items.filter((_, j) => j !== i));
            toast.success("Project removed");
          }}>
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

// Certification editor with certificate URL
function CertificationEditor({ items, onUpdate }: { items: Certification[]; onUpdate: (items: Certification[]) => void }) {
  const handleChange = (index: number, key: string, value: string) => {
    const arr = [...items];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arr[index] as any)[key] = value;
    onUpdate(arr);
  };

  return (
    <div className="space-y-6">
      {items.map((c, i) => (
        <div key={c.id} className="rounded-lg border border-border bg-card p-5 space-y-3">
          <div><Label>Title</Label><Input value={c.title} onChange={(e) => handleChange(i, "title", e.target.value)} /></div>
          <div><Label>Platform</Label><Input value={c.platform} onChange={(e) => handleChange(i, "platform", e.target.value)} /></div>
          <div><Label>Date</Label><Input value={c.date} onChange={(e) => handleChange(i, "date", e.target.value)} /></div>
          <div>
            <Label className="flex items-center gap-1"><Image className="h-3 w-3" /> Certificate Image/URL</Label>
            <Input value={c.certificateUrl || ""} onChange={(e) => handleChange(i, "certificateUrl", e.target.value)} placeholder="https://certificate-image.png" />
          </div>
          {c.certificateUrl && (
            <div className="rounded-md overflow-hidden border border-border">
              <img src={c.certificateUrl} alt={c.title} className="w-full h-32 object-cover" />
            </div>
          )}
          <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => {
            onUpdate(items.filter((_, j) => j !== i));
            toast.success("Certification removed");
          }}>
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
