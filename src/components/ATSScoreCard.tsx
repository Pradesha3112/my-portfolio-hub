import { useMemo } from "react";
import { type PortfolioData } from "@/lib/portfolioData";
import { analyzeATS, type ATSResult, type ATSCategory } from "@/lib/atsScorer";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";

interface ATSScoreCardProps {
  data: PortfolioData;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-500";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

function getScoreIcon(score: number) {
  if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
  return <XCircle className="h-5 w-5 text-red-500" />;
}

function getProgressColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function CategoryCard({ category }: { category: ATSCategory }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category.icon}</span>
          <h4 className="font-semibold text-sm text-foreground">{category.name}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${getScoreColor(category.score)}`}>
            {category.score}/100
          </span>
          {getScoreIcon(category.score)}
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${getProgressColor(category.score)}`}
          style={{ width: `${category.score}%` }}
        />
      </div>
      {category.suggestions.length > 0 && (
        <ul className="space-y-1.5">
          {category.suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
              <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-yellow-500" />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ATSScoreCard({ data }: ATSScoreCardProps) {
  const result: ATSResult = useMemo(() => analyzeATS(data), [data]);

  const ringRadius = 54;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (result.totalScore / 100) * circumference;
  const ringColor = result.totalScore >= 80 ? "#22c55e" : result.totalScore >= 60 ? "#eab308" : "#ef4444";

  return (
    <div className="rounded-lg border-2 border-border bg-card p-5 space-y-5">
      <div className="flex items-start gap-5">
        {/* Circular score gauge */}
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={ringRadius} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
            <circle
              cx="60" cy="60" r={ringRadius} fill="none"
              stroke={ringColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(result.totalScore)}`}>
              {result.totalScore}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {getScoreLabel(result.totalScore)}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg">ATS Compatibility Score</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {result.totalScore >= 80
              ? "Your resume is well-optimized for Applicant Tracking Systems."
              : result.totalScore >= 60
              ? "Your resume is fairly compatible but has room for improvement."
              : "Your resume needs significant improvements for better ATS performance."}
          </p>
          <div className="flex gap-3 mt-3 flex-wrap">
            {result.categories.map((cat) => (
              <span key={cat.name} className={`text-xs font-medium px-2 py-1 rounded-full border ${
                cat.score >= 80 ? "border-green-200 bg-green-50 text-green-700"
                : cat.score >= 60 ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                : "border-red-200 bg-red-50 text-red-700"
              }`}>
                {cat.icon} {cat.name}: {cat.score}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdowns */}
      <div className="grid gap-3 sm:grid-cols-2">
        {result.categories.map((cat) => (
          <CategoryCard key={cat.name} category={cat} />
        ))}
      </div>
    </div>
  );
}
