import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, logout } from "@/lib/auth";
import { usePortfolio } from "@/hooks/usePortfolio";
import { generateId, type Education, type Internship, type Project, type Certification } from "@/lib/portfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { LogOut, Trash2, Plus, Undo2, RotateCcw, Save, Palette, Check } from "lucide-react";
import { themeOptions, getSavedTheme, saveTheme, type ThemeOption } from "@/lib/themeManager";

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
            <SectionEditor<Internship>
              items={data.internships}
              onUpdate={(items) => update((d) => ({ ...d, internships: items }))}
              fields={[
                { key: "role", label: "Role" },
                { key: "organization", label: "Organization" },
                { key: "duration", label: "Duration" },
                { key: "responsibilities", label: "Responsibilities", multiline: true },
              ]}
              createNew={() => ({ id: generateId(), role: "", organization: "", duration: "", responsibilities: "" })}
            />
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
            <SectionEditor<Certification>
              items={data.certifications}
              onUpdate={(items) => update((d) => ({ ...d, certifications: items }))}
              fields={[
                { key: "title", label: "Title" },
                { key: "platform", label: "Platform" },
                { key: "date", label: "Date" },
              ]}
              createNew={() => ({ id: generateId(), title: "", platform: "", date: "" })}
            />
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
          <div className="max-w-lg space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <Palette className="h-5 w-5" /> Theme Settings
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Select a theme for your portfolio. The theme will be applied globally and persist across sessions.</p>
            </div>
            <div className="grid gap-3">
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
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    t.value === "light" ? "bg-[hsl(0,0%,98%)] border border-[hsl(0,0%,85%)]" :
                    t.value === "dark" ? "bg-[hsl(0,0%,15%)]" :
                    t.value === "glassmorphism" ? "bg-gradient-to-br from-[hsl(250,60%,80%)] to-[hsl(280,40%,85%)]" :
                    "bg-gradient-to-br from-[hsl(200,90%,55%)] to-[hsl(215,80%,30%)]"
                  }`}>
                    {selectedTheme === t.value && <Check className={`h-5 w-5 ${t.value === "dark" || t.value === "gradient-blue" ? "text-[hsl(0,0%,95%)]" : "text-[hsl(0,0%,15%)]"}`} />}
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

// Project editor with featured toggle
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
