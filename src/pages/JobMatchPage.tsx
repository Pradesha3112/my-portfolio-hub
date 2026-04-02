import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "@/lib/auth";
import { getPortfolioData, type PortfolioData } from "@/lib/portfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Download,
  FileEdit,
  Loader2,
  Target,
  Zap,
  AlertTriangle,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

interface MatchingKeyword {
  keyword: string;
  category: "skills" | "experience" | "tools" | "keywords";
}

interface MissingKeyword {
  keyword: string;
  category: "skills" | "experience" | "tools" | "keywords";
  importance: "critical" | "recommended" | "nice-to-have";
}

interface Suggestion {
  category: "skills" | "experience" | "tools" | "keywords";
  suggestion: string;
  priority: "high" | "medium" | "low";
}

interface OptimizedBullet {
  original: string;
  improved: string;
  reason: string;
}

interface AnalysisResult {
  overallScore: number;
  matchingKeywords: MatchingKeyword[];
  missingKeywords: MissingKeyword[];
  suggestions: Suggestion[];
  optimizedSummary: string;
  optimizedBullets: OptimizedBullet[];
  categoryScores: {
    skills: number;
    experience: number;
    tools: number;
    keywords: number;
  };
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  skills: <Zap className="w-4 h-4" />,
  experience: <TrendingUp className="w-4 h-4" />,
  tools: <Target className="w-4 h-4" />,
  keywords: <Search className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  skills: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  experience: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  tools: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  keywords: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
};

const IMPORTANCE_COLORS: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  recommended: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  "nice-to-have": "bg-muted text-muted-foreground border-border",
};

const PRIORITY_BADGE: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "bg-muted text-muted-foreground",
};

function buildResumeText(data: PortfolioData): string {
  const lines: string[] = [];
  lines.push(data.name, data.role, "");
  lines.push("SUMMARY", data.intro, "");
  lines.push("SKILLS");
  Object.entries(data.skills).forEach(([cat, items]) => {
    lines.push(`${cat}: ${items.join(", ")}`);
  });
  lines.push("");
  lines.push("EXPERIENCE");
  data.internships.forEach((i) => {
    lines.push(`${i.role} at ${i.organization} (${i.duration})`);
    lines.push(i.responsibilities);
    lines.push("");
  });
  lines.push("PROJECTS");
  data.projects.forEach((p) => {
    lines.push(`${p.title} [${p.techStack.join(", ")}]`);
    lines.push(p.description);
    lines.push("");
  });
  lines.push("CERTIFICATIONS");
  data.certifications.forEach((c) => lines.push(`${c.title} – ${c.platform} (${c.date})`));
  lines.push("");
  lines.push("EDUCATION");
  data.education.forEach((e) => lines.push(`${e.course} – ${e.institution} (${e.duration}) ${e.score}`));
  lines.push("");
  lines.push("ACHIEVEMENTS");
  data.achievements.forEach((a) => lines.push(`• ${a}`));
  return lines.join("\n");
}

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80 ? "text-green-500" : score >= 60 ? "text-amber-500" : "text-destructive";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
          <circle
            cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"
            className={color}
            strokeDasharray={`${(score / 100) * 175.9} 175.9`}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>
          {score}
        </span>
      </div>
      <span className="text-xs text-muted-foreground capitalize">{label}</span>
    </div>
  );
}

export default function JobMatchPage() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const hasAutoAnalyzed = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("jobMatchDescription");
    if (saved && !hasAutoAnalyzed.current) {
      setJobDescription(saved);
      localStorage.removeItem("jobMatchDescription");
      hasAutoAnalyzed.current = true;
      // Auto-trigger analysis after state is set
      setTimeout(() => {
        document.getElementById("analyze-btn")?.click();
      }, 100);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }
    if (jobDescription.trim().length < 50) {
      toast.error("Job description seems too short. Please paste the full description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = getPortfolioData();
      const resumeText = buildResumeText(data);

      const { data: fnData, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText, jobDescription: jobDescription.trim() },
      });

      if (error) {
        throw new Error(error.message || "Analysis failed");
      }

      if (fnData?.error) {
        toast.error(fnData.error);
        return;
      }

      setResult(fnData as AnalysisResult);
      toast.success("Analysis complete!");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast.error(err.message || "Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToResume = () => {
    if (!result) return;
    // Save optimized summary to portfolio data
    const data = getPortfolioData();
    data.intro = result.optimizedSummary;
    data.lastEdited = new Date().toISOString();
    localStorage.setItem("portfolio_data", JSON.stringify(data));
    toast.success("Optimized summary applied! Go to Dashboard to see changes.");
    navigate("/dashboard");
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "text-green-500" : score >= 60 ? "text-amber-500" : "text-destructive";

  const filteredSuggestions = activeCategory
    ? result?.suggestions.filter((s) => s.category === activeCategory)
    : result?.suggestions;

  const filteredMissing = activeCategory
    ? result?.missingKeywords.filter((k) => k.category === activeCategory)
    : result?.missingKeywords;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Job Match Analyzer
            </h1>
            <p className="text-sm text-muted-foreground">
              Paste a job description to see how well your resume matches and get AI-powered optimization suggestions
            </p>
          </div>
        </div>

        {/* Job Description Input */}
        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">
            Job Description
          </label>
          <Textarea
            placeholder="Paste the full job description here..."
            className="min-h-[180px] text-sm"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">
              {jobDescription.length > 0 ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : ""}
            </span>
            <Button id="analyze-btn" onClick={handleAnalyze} disabled={loading || !jobDescription.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Match
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Score Overview */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Main score */}
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                      <circle
                        cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="6"
                        className={scoreColor(result.overallScore)}
                        strokeDasharray={`${(result.overallScore / 100) * 301.6} 301.6`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${scoreColor(result.overallScore)}`}>
                      {result.overallScore}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground mt-2">Overall Match</span>
                </div>

                {/* Category scores */}
                <div className="flex gap-6 flex-wrap justify-center">
                  {result.categoryScores && Object.entries(result.categoryScores).map(([cat, score]) => (
                    <ScoreGauge key={cat} score={score} label={cat} />
                  ))}
                </div>

                {/* Quick stats */}
                <div className="flex-1 grid grid-cols-2 gap-3 text-center md:text-left">
                  <div className="rounded-lg bg-green-500/10 p-3">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {result.matchingKeywords.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Matching Keywords</div>
                  </div>
                  <div className="rounded-lg bg-destructive/10 p-3">
                    <div className="text-lg font-bold text-destructive">
                      {result.missingKeywords.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Missing Keywords</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {["skills", "experience", "tools", "keywords"].map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="capitalize"
                >
                  {CATEGORY_ICONS[cat]}
                  <span className="ml-1">{cat}</span>
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Matching Keywords */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Matching Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(activeCategory
                    ? result.matchingKeywords.filter((k) => k.category === activeCategory)
                    : result.matchingKeywords
                  ).map((kw, i) => (
                    <Badge key={i} variant="outline" className={CATEGORY_COLORS[kw.category]}>
                      {kw.keyword}
                    </Badge>
                  ))}
                  {(activeCategory
                    ? result.matchingKeywords.filter((k) => k.category === activeCategory)
                    : result.matchingKeywords
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground">No matching keywords found in this category.</p>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-destructive" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(filteredMissing || []).map((kw, i) => (
                    <Badge key={i} variant="outline" className={IMPORTANCE_COLORS[kw.importance]}>
                      {kw.importance === "critical" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {kw.keyword}
                    </Badge>
                  ))}
                  {(filteredMissing || []).length === 0 && (
                    <p className="text-sm text-muted-foreground">Great! No missing keywords in this category.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Actionable Suggestions
              </h3>
              <div className="space-y-3">
                {(filteredSuggestions || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="mt-0.5">{CATEGORY_ICONS[s.category]}</span>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{s.suggestion}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className={`text-[10px] ${PRIORITY_BADGE[s.priority]}`}>
                          {s.priority} priority
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {s.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimized Bullets */}
            {result.optimizedBullets && result.optimizedBullets.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <FileEdit className="w-5 h-5 text-primary" />
                  Suggested Bullet Improvements
                </h3>
                <div className="space-y-4">
                  {result.optimizedBullets.map((b, i) => (
                    <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground line-through">{b.original}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">{b.improved}</p>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6 italic">💡 {b.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optimized Summary + Actions */}
            {result.optimizedSummary && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-green-500" />
                  Optimized Professional Summary
                </h3>
                <p className="text-sm text-foreground leading-relaxed mb-4">
                  {result.optimizedSummary}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={handleApplyToResume} className="gap-2">
                    <FileEdit className="w-4 h-4" />
                    Apply to Resume & Edit
                  </Button>
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(result.optimizedSummary);
                    toast.success("Copied to clipboard!");
                  }}>
                    Copy Summary
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
