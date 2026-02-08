import { Mail, Linkedin, Github } from "lucide-react";
import { getPortfolioData } from "@/lib/portfolioData";

export default function Footer() {
  const d = getPortfolioData();
  return (
    <footer className="border-t border-border bg-muted/30 py-8 mt-16">
      <div className="container flex flex-col items-center gap-4 text-center">
        <div className="flex gap-4">
          <a href={`mailto:${d.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="h-5 w-5" />
          </a>
          <a href={d.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href={d.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-5 w-5" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {d.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
