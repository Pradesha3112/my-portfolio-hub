import { useMemo } from "react";
import { type PortfolioData, type ResumeFormatting, type ResumeSectionId, DEFAULT_FORMATTING, DEFAULT_SECTION_ORDER, getResumeItems } from "@/lib/portfolioData";

interface ResumePreviewProps {
  data: PortfolioData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const fmt: ResumeFormatting = useMemo(() => ({ ...DEFAULT_FORMATTING, ...data.resumeFormatting }), [data.resumeFormatting]);
  const { projects, internships, certifications, skillCategories } = useMemo(() => getResumeItems(data), [data]);
  const sectionOrder: ResumeSectionId[] = data.resumeSelections?.sectionOrder || DEFAULT_SECTION_ORDER;

  const catLabels: Record<string, string> = {
    languages: "Programming Languages",
    tools: "Tools & Technologies",
    platforms: "Platforms & IDEs",
    other: "Professional Skills",
  };

  const px = (mm: number) => `${mm * 3.78}px`; // mm to px approx
  const fontStyle = (style: string) => ({
    fontWeight: style === "bold" ? 700 : 400,
    fontStyle: style === "italic" ? "italic" as const : "normal" as const,
  });

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }
    catch { return ""; }
  };

  const SectionHeading = ({ title }: { title: string }) => (
    <div style={{ marginTop: `${fmt.sectionGapBefore}px`, marginBottom: `${fmt.sectionGapAfter}px` }}>
      <h2 style={{
        fontSize: `${fmt.headingFontSize}px`,
        color: fmt.headingColor,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        margin: 0,
        ...fontStyle(fmt.headingStyle),
      }}>
        {title}
      </h2>
      {fmt.showSectionLines && (
        <div style={{ borderBottom: `1.5px solid ${fmt.headingColor}`, marginTop: "2px", opacity: 0.6 }} />
      )}
    </div>
  );

  const Bullet = ({ text }: { text: string }) => (
    <div style={{
      fontSize: `${fmt.bodyFontSize}px`,
      lineHeight: fmt.lineHeightMultiplier,
      marginBottom: `${fmt.bulletSpacing}px`,
      paddingLeft: "12px",
      textIndent: "-12px",
      ...fontStyle(fmt.bodyStyle),
    }}>
      •&nbsp;&nbsp;{text}
    </div>
  );

  const renderers: Record<ResumeSectionId, () => React.ReactNode> = {
    summary: () => {
      if (fmt.hiddenSections.includes("summary")) return null;
      return (
        <div key="summary">
          <SectionHeading title="Professional Summary" />
          <p style={{ fontSize: `${fmt.bodyFontSize}px`, lineHeight: fmt.lineHeightMultiplier, margin: 0, ...fontStyle(fmt.bodyStyle) }}>
            {data.intro}
          </p>
        </div>
      );
    },
    skills: () => {
      if (fmt.hiddenSections.includes("skills")) return null;
      return (
        <div key="skills">
          <SectionHeading title="Skills" />
          {skillCategories.map((cat) => {
            const skills = data.skills[cat];
            if (!skills?.length) return null;
            return (
              <div key={cat} style={{ fontSize: `${fmt.bodyFontSize}px`, lineHeight: fmt.lineHeightMultiplier, marginBottom: "3px" }}>
                <strong>{catLabels[cat] || cat}:</strong> {skills.join(", ")}
              </div>
            );
          })}
        </div>
      );
    },
    projects: () => {
      if (!projects.length || fmt.hiddenSections.includes("projects")) return null;
      return (
        <div key="projects">
          <SectionHeading title="Projects" />
          {projects.map((p, idx) => {
            const dates = [p.startDate && formatDate(p.startDate), p.endDate && formatDate(p.endDate)].filter(Boolean).join(" - ") || (p.singleDate ? formatDate(p.singleDate) : "");
            const bullets = p.description.split(/\.\s*/).filter(s => s.trim().length > 0);
            return (
              <div key={p.id} style={{ marginBottom: idx < projects.length - 1 ? `${fmt.itemSpacing ?? 3}px` : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: `${fmt.bodyFontSize + 0.5}px` }}>{p.title}</strong>
                  {dates && <span style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, color: "#555" }}>{dates}</span>}
                </div>
                {p.techStack.length > 0 && (
                  <div style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, fontStyle: "italic", color: "#444", marginBottom: `${fmt.subItemSpacing ?? 2}px` }}>
                    Technologies: {p.techStack.join(", ")}
                  </div>
                )}
                {bullets.map((b, i) => <Bullet key={i} text={b.trim().replace(/\.$/, "")} />)}
              </div>
            );
          })}
        </div>
      );
    },
    experience: () => {
      if (!internships.length || fmt.hiddenSections.includes("experience")) return null;
      return (
        <div key="experience">
          <SectionHeading title="Work Experience" />
          {internships.map((e, idx) => {
            const dates = [e.startDate && formatDate(e.startDate), e.endDate && formatDate(e.endDate)].filter(Boolean).join(" - ") || (e.singleDate ? formatDate(e.singleDate) : "") || e.duration;
            const bullets = e.responsibilityBullets && e.responsibilityBullets.length > 0
              ? e.responsibilityBullets.filter(s => s.trim().length > 0)
              : e.responsibilities.split(/\.\s*/).filter(s => s.trim().length > 0);
            return (
              <div key={e.id} style={{ marginBottom: idx < internships.length - 1 ? `${fmt.itemSpacing ?? 3}px` : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: `${fmt.bodyFontSize + 0.5}px` }}>{e.role}</strong>
                  {dates && <span style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, color: "#555" }}>{dates}</span>}
                </div>
                <div style={{ fontSize: `${fmt.bodyFontSize}px`, fontStyle: "italic", color: "#444", marginBottom: `${fmt.subItemSpacing ?? 2}px` }}>
                  {e.organization}
                </div>
                {e.techStack && e.techStack.length > 0 && (
                  <div style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, fontStyle: "italic", color: "#444", marginBottom: `${fmt.subItemSpacing ?? 2}px` }}>
                    Technologies: {e.techStack.join(", ")}
                  </div>
                )}
                {bullets.map((b, i) => <Bullet key={i} text={b.trim().replace(/\.$/, "")} />)}
              </div>
            );
          })}
        </div>
      );
    },
    certifications: () => {
      if (!certifications.length || fmt.hiddenSections.includes("certifications")) return null;
      return (
        <div key="certifications">
          <SectionHeading title="Certifications" />
          {certifications.map((c) => (
            <Bullet key={c.id} text={`${c.title} — ${c.platform}${c.date ? ` (${c.date})` : ""}`} />
          ))}
        </div>
      );
    },
    education: () => {
      if (!data.education?.length || fmt.hiddenSections.includes("education")) return null;
      return (
        <div key="education">
          <SectionHeading title="Education" />
          {data.education.map((edu, idx) => (
            <div key={edu.id} style={{ marginBottom: idx < data.education.length - 1 ? `${fmt.itemSpacing ?? 3}px` : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: `${fmt.bodyFontSize + 0.5}px` }}>{edu.course}</strong>
                {edu.duration && <span style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, color: "#555" }}>{edu.duration}</span>}
              </div>
              <div style={{ fontSize: `${fmt.bodyFontSize}px`, color: "#444", marginBottom: `${fmt.subItemSpacing ?? 2}px` }}>{edu.institution}</div>
              {edu.score && <div style={{ fontSize: `${fmt.bodyFontSize}px`, color: "#555" }}>{edu.score}</div>}
            </div>
          ))}
        </div>
      );
    },
    achievements: () => {
      if (!data.achievements?.length || fmt.hiddenSections.includes("achievements")) return null;
      return (
        <div key="achievements">
          <SectionHeading title="Achievements" />
          {data.achievements.map((a, i) => <Bullet key={i} text={a} />)}
        </div>
      );
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "595px", // A4 width in px at 72dpi
        margin: "0 auto",
        padding: px(fmt.marginMM),
        background: "white",
        color: "#000",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: `${fmt.bodyFontSize}px`,
        lineHeight: fmt.lineHeightMultiplier,
        boxShadow: "0 2px 20px rgba(0,0,0,0.15)",
        borderRadius: "4px",
        minHeight: "842px", // A4 height approx
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <h1 style={{
          fontSize: `${fmt.nameFontSize}px`,
          margin: 0,
          letterSpacing: "1px",
          textTransform: "uppercase",
          ...fontStyle(fmt.nameStyle),
        }}>
          {data.name}
        </h1>
        <div style={{ fontSize: `${fmt.bodyFontSize}px`, margin: "4px 0" }}>
          {data.role}
        </div>
        <div style={{ fontSize: `${fmt.contactFontSize}px`, color: "#555" }}>
          {[data.email, data.linkedin, data.github].filter(Boolean).join("  |  ")}
        </div>
      </div>

      {/* Sections */}
      {sectionOrder.map((id) => renderers[id] ? renderers[id]() : null)}
    </div>
  );
}
