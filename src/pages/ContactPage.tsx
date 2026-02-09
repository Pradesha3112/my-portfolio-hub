import { useState } from "react";
import { getPortfolioData } from "@/lib/portfolioData";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const d = getPortfolioData();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    // Since no backend, open mailto
    const mailtoLink = `mailto:${d.email}?subject=${encodeURIComponent(form.subject || "Portfolio Contact")}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`;
    window.open(mailtoLink, "_blank");
    toast.success("Opening your email client...");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="py-16">
      <div className="container max-w-2xl">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-foreground mb-2">Get in Touch</h1>
          <p className="text-muted-foreground mb-10">
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
    </main>
  );
}
