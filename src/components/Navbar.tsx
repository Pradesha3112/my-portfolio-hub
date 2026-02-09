import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAdmin, logout } from "@/lib/auth";
import { Menu, X, Shield, LogOut, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/education", label: "Education" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/certifications", label: "Certifications" },
  { to: "/skills", label: "Skills" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const admin = isAdmin();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold text-foreground">
          Pradesha<span className="text-primary">.</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
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
          <a href="/PRADESHA_S_Resume.pdf" download>
            <Button variant="outline" size="sm" className="ml-2 gap-1">
              <Download className="h-4 w-4" /> Resume
            </Button>
          </a>
          <ThemeToggle />
          {admin && (
            <>
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
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {l.label}
            </Link>
          ))}
          <a href="/PRADESHA_S_Resume.pdf" download className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            📄 Download Resume
          </a>
          {admin && (
            <>
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
