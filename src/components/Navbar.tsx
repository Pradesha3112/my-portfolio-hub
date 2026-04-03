import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAdmin, logout } from "@/lib/auth";
import { Menu, X, Shield, LogOut, Download, Target } from "lucide-react";
import VersionSwitcher from "@/components/VersionSwitcher";
import { Button } from "@/components/ui/button";
import { generateResume } from "@/lib/resumeGenerator";
import { toast } from "sonner";

const anchorLinks = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
];

const pageLinks = [
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const admin = isAdmin();

  const scrollToSection = useCallback((id: string) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
    setOpen(false);
  }, [location.pathname, navigate]);

  const handleDownloadResume = async () => {
    try {
      await generateResume();
      toast.success("Resume generated with latest data!");
    } catch {
      toast.error("Failed to generate resume");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <button onClick={() => scrollToSection("home")} className="text-xl font-bold text-foreground">
          Pradesha<span className="text-primary">.</span>
        </button>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {anchorLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              {l.label}
            </button>
          ))}
          {pageLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                location.pathname === l.to ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" className="ml-2 gap-1" onClick={handleDownloadResume}>
            <Download className="h-4 w-4" /> Resume
          </Button>
          {admin && (
            <>
              <Link to="/job-match">
                <Button variant="outline" size="sm" className="gap-1">
                  <Target className="h-4 w-4" /> Job Match
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="sm" className="ml-1 gap-1">
                  <Shield className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { logout(); window.location.href = "/"; }}
                className="gap-1"
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background p-4 md:hidden animate-fade-in">
          {anchorLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              className="block w-full text-left rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {l.label}
            </button>
          ))}
          {pageLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {l.label}
            </Link>
          ))}
          <button onClick={handleDownloadResume} className="block w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            📄 Download Resume
          </button>
          {admin && (
            <>
              <Link to="/job-match" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-muted-foreground">
                🎯 Job Match
              </Link>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-muted-foreground">
                🔐 Dashboard
              </Link>
              <button onClick={() => { logout(); window.location.href = "/"; }} className="block w-full text-left px-3 py-2 text-sm font-medium text-destructive">
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Admin badge */}
      {admin && (
        <div className="bg-primary text-primary-foreground text-center text-xs py-1 font-medium">
          🔐 Admin Mode ON
        </div>
      )}
    </nav>
  );
}
