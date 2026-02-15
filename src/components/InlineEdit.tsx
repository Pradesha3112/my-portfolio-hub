import { useState } from "react";
import { isAdmin } from "@/lib/auth";
import { getPortfolioData, savePortfolioData, generateId, type PortfolioData, type Education, type Internship, type Project, type Certification } from "@/lib/portfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

// Hook to manage inline edits with re-render
export function useInlineData() {
  const [revision, setRevision] = useState(0);
  const data = getPortfolioData();

  const save = (updater: (d: PortfolioData) => PortfolioData) => {
    const current = getPortfolioData();
    const next = updater(current);
    savePortfolioData(next);
    setRevision((r) => r + 1);
  };

  return { data, save, revision };
}

// Delete button with confirmation dialog
export function DeleteButton({ onDelete, label = "item" }: { onDelete: () => void; label?: string }) {
  const [open, setOpen] = useState(false);
  if (!isAdmin()) return null;
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive h-8 w-8"
        onClick={() => setOpen(true)}
        title={`Delete ${label}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {label}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this {label}? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onDelete(); setOpen(false); toast.success(`${label} removed`); }}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Education edit dialog
export function EditEducationDialog({
  item,
  onSave,
  trigger,
}: {
  item?: Education;
  onSave: (item: Education) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Education>(
    item || { id: generateId(), institution: "", course: "", duration: "", score: "" }
  );

  const handleSave = () => {
    onSave(form);
    setOpen(false);
    toast.success(item ? "Education updated" : "Education added");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Add"} Education</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Institution</Label><Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} /></div>
          <div><Label>Course / Degree</Label><Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></div>
          <div><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
          <div><Label>Score</Label><Input value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} /></div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Internship edit dialog
export function EditInternshipDialog({
  item,
  onSave,
  trigger,
}: {
  item?: Internship;
  onSave: (item: Internship) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Internship>(
    item || { id: generateId(), role: "", organization: "", duration: "", responsibilities: "" }
  );

  const handleSave = () => {
    onSave(form);
    setOpen(false);
    toast.success(item ? "Experience updated" : "Experience added");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Add"} Experience</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
          <div><Label>Organization</Label><Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></div>
          <div><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
          <div><Label>Responsibilities</Label><Textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={3} /></div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Project edit dialog (inline, used on public pages)
export function EditProjectDialog({
  item,
  onSave,
  trigger,
}: {
  item?: Project;
  onSave: (item: Project) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Project>(
    item || { id: generateId(), title: "", description: "", techStack: [], link: "", featured: false }
  );

  const handleSave = () => {
    onSave(form);
    setOpen(false);
    toast.success(item ? "Project updated" : "Project added");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Add"} Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div><Label>Tech Stack (comma-separated)</Label><Input value={form.techStack.join(", ")} onChange={(e) => setForm({ ...form, techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
          <div><Label>Project Link</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
          <div><Label>Demo / Try Out URL</Label><Input value={form.demoUrl || ""} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} placeholder="https://demo-url.com" /></div>
          <div><Label>GitHub Link</Label><Input value={form.githubLink || ""} onChange={(e) => setForm({ ...form, githubLink: e.target.value })} placeholder="https://github.com/..." /></div>
          <div className="flex items-center gap-2">
            <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
            <Label>Featured</Label>
          </div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Certification edit dialog
export function EditCertificationDialog({
  item,
  onSave,
  trigger,
}: {
  item?: Certification;
  onSave: (item: Certification) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Certification>(
    item || { id: generateId(), title: "", platform: "", date: "" }
  );

  const handleSave = () => {
    onSave(form);
    setOpen(false);
    toast.success(item ? "Certification updated" : "Certification added");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Add"} Certification</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Platform</Label><Input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} /></div>
          <div><Label>Date</Label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Admin action bar for a section item
export function AdminActions({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) return null;
  return <div className="flex gap-1 mt-2">{children}</div>;
}

// Add button for sections
export function AddButton({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) return null;
  return <div className="mt-6">{children}</div>;
}
