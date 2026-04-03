import { useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolioData, savePortfolioData, type PortfolioData } from "@/lib/portfolioData";
import { isAdmin } from "@/lib/auth";
import { usePortfolioVersion } from "@/contexts/PortfolioVersionContext";
import { PORTFOLIO_VERSIONS } from "@/lib/portfolioVersions";
import AnimatedSection from "@/components/AnimatedSection";
import SkillBar from "@/components/SkillBar";
import { Mail, Linkedin, Github, ArrowRight, GraduationCap, Pencil, Plus, Award, Trophy, Trash2, Check, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  useInlineData,
  EditEducationDialog,
  EditCertificationDialog,
  DeleteButton,
  AdminActions,
  AddButton,
} from "@/components/InlineEdit";

const skillCategories = [
  { key: "languages", label: "Languages", showBar: true },
  { key: "tools", label: "Tools", showBar: false },
  { key: "platforms", label: "Platforms", showBar: false },
  { key: "other", label: "Other Skills", showBar: false },
] as const;

export default function Index() {
  const { data: d, save } = useInlineData();
  const admin = isAdmin();
  const { version, setVersion } = usePortfolioVersion();
  const currentVersion = PORTFOLIO_VERSIONS.find((v) => v.id === version)!;
  const featured = d.projects.filter((p) => p.featured).slice(0, 3);

  // Skills editing state
  const [editingSkills, setEditingSkills] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Achievement editing state
  const [editingAchievement, setEditingAchievement] = useState<number | null>(null);
  const [achievementValue, setAchievementValue] = useState("");

  // Contact form state
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startEditSkills = (cat: string) => {
    setEditingSkills(cat);
    setEditValue(d.skills[cat as keyof typeof d.skills].join(", "));
  };
  const saveSkills = (cat: string) => {
    const arr = editValue.split(",").map((s) => s.trim()).filter(Boolean);
    save((d) => ({ ...d, skills: { ...d.skills, [cat]: arr } }));
    setEditingSkills(null);
    toast.success("Skills updated");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const mailtoLink = `mailto:${d.email}?subject=${encodeURIComponent(form.subject || "Portfolio Contact")}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`;
    window.open(mailtoLink, "_blank");
    toast.success("Opening your email client...");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main>
      {/* ===== HERO ===== */}
      <section id="home" className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent via-background to-secondary opacity-60" />
        <div className="container text-center">
          <AnimatedSection>
            <Badge variant="secondary" className="mb-4 text-sm">{d.role}</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Hi, I'm <span className="text-primary">{d.name}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{d.intro}</p>
            <div className="mt-8 flex justify-center gap-3">
              <a href="#contact">
                <Button variant="default" className="gap-2">
                  <Mail className="h-4 w-4" /> Contact Me
                </Button>
              </a>
              <Link to="/projects">
                <Button variant="outline" className="gap-2">
                  View My Work <ArrowRight className="h-4 w-4" />
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

      {/* ===== EDUCATION ===== */}
      <section id="education" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground mb-2 text-center">Education & Schooling</h2>
            <p className="text-muted-foreground mb-10 text-center">My academic journey</p>
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
      </section>

      {/* ===== FEATURED PROJECTS PREVIEW ===== */}
      {featured.length > 0 && (
        <section className="py-16 scroll-mt-20">
          <div className="container">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Projects</h2>
            </AnimatedSection>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 150}>
                  <div className="rounded-lg border border-border bg-card hover:shadow-md transition-shadow h-full flex flex-col overflow-hidden">
                    {(p.thumbnail || (p.images && p.images.length > 0)) && (
                      <div className="w-full h-40 overflow-hidden">
                        <img src={p.thumbnail || p.images![0]} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground flex-1">{p.description}</p>
                      {p.demoUrl && (
                        <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                          Try Out / Demo
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/projects">
                <Button variant="default" className="gap-2">
                  View More Projects <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SKILLS ===== */}
      <section id="skills" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground mb-2 text-center">Skills & Achievements</h2>
            <p className="text-muted-foreground mb-10 text-center">My technical abilities and accomplishments</p>
          </AnimatedSection>

          {skillCategories.map((cat, ci) => (
            <AnimatedSection key={cat.key} delay={(ci + 1) * 100}>
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold text-foreground">{cat.label}</h3>
                  {admin && editingSkills !== cat.key && (
                    <Button variant="ghost" size="sm" onClick={() => startEditSkills(cat.key)} className="gap-1">
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                  )}
                </div>
                {editingSkills === cat.key ? (
                  <div className="space-y-2">
                    <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="Comma-separated values" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveSkills(cat.key)} className="gap-1"><Check className="h-3 w-3" /> Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingSkills(null)} className="gap-1"><X className="h-3 w-3" /> Cancel</Button>
                    </div>
                  </div>
                ) : cat.showBar ? (
                  <div className="grid gap-x-12 gap-y-1 md:grid-cols-2">
                    {d.skills[cat.key].map((s) => (
                      <SkillBar key={s} name={s} level={d.skillLevels?.[s] || "Intermediate"} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {d.skills[cat.key].map((s) => (
                      <Badge key={s} variant={cat.key === "platforms" ? "outline" : "secondary"} className="text-sm py-1.5 px-3">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}

          {/* Achievements */}
          <AnimatedSection delay={500}>
            <h3 className="text-xl font-semibold text-foreground mb-4">Achievements</h3>
            <div className="space-y-3">
              {d.achievements.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                  <Trophy className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  {editingAchievement === i ? (
                    <div className="flex-1 flex gap-2">
                      <Input value={achievementValue} onChange={(e) => setAchievementValue(e.target.value)} className="flex-1" />
                      <Button size="sm" onClick={() => {
                        save((d) => ({ ...d, achievements: d.achievements.map((x, j) => j === i ? achievementValue : x) }));
                        setEditingAchievement(null);
                        toast.success("Achievement updated");
                      }}><Check className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingAchievement(null)}><X className="h-3 w-3" /></Button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-start justify-between">
                      <p className="text-sm text-card-foreground">{a}</p>
                      {admin && (
                        <div className="flex gap-1 ml-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingAchievement(i); setAchievementValue(a); }}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => {
                            save((d) => ({ ...d, achievements: d.achievements.filter((_, j) => j !== i) }));
                            toast.success("Achievement removed");
                          }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {admin && (
              <Button variant="outline" className="mt-4 gap-1" onClick={() => {
                save((d) => ({ ...d, achievements: [...d.achievements, "New achievement"] }));
                toast.success("Achievement added");
              }}>
                <Plus className="h-4 w-4" /> Add Achievement
              </Button>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CERTIFICATIONS ===== */}
      <section id="certifications" className="py-16 scroll-mt-20">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground mb-2 text-center">Certifications</h2>
            <p className="text-muted-foreground mb-8 text-center">Courses and certifications I've completed</p>
          </AnimatedSection>
          <div className="space-y-4">
            {d.certifications.map((c, i) => (
              <AnimatedSection key={c.id} delay={i * 100}>
                <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                    <Award className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">{c.platform}</p>
                    {c.date && <p className="text-xs text-muted-foreground mt-1">{c.date}</p>}
                    {c.certificateUrl && (
                      <div className="mt-2 rounded-md overflow-hidden border border-border">
                        <a href={c.certificateUrl} target="_blank" rel="noopener noreferrer">
                          <img src={c.certificateUrl} alt={c.title} className="w-full h-32 object-cover hover:opacity-90 transition-opacity" />
                        </a>
                      </div>
                    )}
                    <AdminActions>
                      <EditCertificationDialog
                        item={c}
                        onSave={(updated) => save((d) => ({ ...d, certifications: d.certifications.map((x) => x.id === updated.id ? updated : x) }))}
                        trigger={<Button variant="ghost" size="sm" className="gap-1"><Pencil className="h-3 w-3" /> Edit</Button>}
                      />
                      <DeleteButton label="certification" onDelete={() => save((d) => ({ ...d, certifications: d.certifications.filter((x) => x.id !== c.id) }))} />
                    </AdminActions>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AddButton>
            <EditCertificationDialog
              onSave={(item) => save((d) => ({ ...d, certifications: [...d.certifications, item] }))}
              trigger={<Button variant="outline" className="gap-1"><Plus className="h-4 w-4" /> Add Certification</Button>}
            />
          </AddButton>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container max-w-2xl">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground mb-2 text-center">Get in Touch</h2>
            <p className="text-muted-foreground mb-10 text-center">
              Have a question or want to work together? Send me a message!
            </p>
          </AnimatedSection>

          <div className="grid gap-10 md:grid-cols-5">
            <AnimatedSection delay={100} className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={5} />
                  {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                </div>
                <Button type="submit" className="gap-2 w-full sm:w-auto">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            </AnimatedSection>

            <AnimatedSection delay={200} className="md:col-span-2">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Contact Info</h3>
                  <div className="space-y-3">
                    <a href={`mailto:${d.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="h-4 w-4" /> {d.email}
                    </a>
                    <a href={d.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                    <a href={d.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
}
