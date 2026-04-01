import { useMemo } from "react";
import { type PortfolioData, type ResumeFormatting, type ResumeSectionId, DEFAULT_FORMATTING, DEFAULT_SECTION_ORDER, getResumeItems } from "@/lib/portfolioData";

const FONT_CSS_MAP: Record<string, string> = {
  Helvetica: "Helvetica, Arial, sans-serif",
  Times: "'Times New Roman', Times, serif",
  Courier: "'Courier New', Courier, monospace",
  Georgia: "Georgia, 'Times New Roman', serif",
  Garamond: "Garamond, 'Times New Roman', serif",
};

interface ResumePreviewProps {
  data: PortfolioData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const fmt: ResumeFormatting = useMemo(() => ({ ...DEFAULT_FORMATTING, ...data.resumeFormatting }), [data.resumeFormatting]);
  const { projects, internships, certifications, skillCategories } = useMemo(() => getResumeItems(data), [data]);
  const sectionOrder: ResumeSectionId[] = data.resumeSelections?.sectionOrder || DEFAULT_SECTION_ORDER;
  const templateId = fmt.templateId || "classic";

  const fontFamily = FONT_CSS_MAP[fmt.fontFamily] || FONT_CSS_MAP.Helvetica;

  const LinkLabel = ({ label, url }: { label: string; url: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ color: fmt.linkColor, textDecoration: "underline", textUnderlineOffset: "2px" }}>
      {label}
    </a>
  );

  const catLabels: Record<string, string> = {
    languages: "Programming Languages",
    tools: "Tools & Technologies",
    platforms: "Platforms & IDEs",
    other: "Professional Skills",
  };

  const px = (mm: number) => `${mm * 3.78}px`;
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
      color: fmt.bodyColor,
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
          <p style={{ fontSize: `${fmt.bodyFontSize}px`, lineHeight: fmt.lineHeightMultiplier, margin: 0, color: fmt.bodyColor, ...fontStyle(fmt.bodyStyle) }}>
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
              <div key={cat} style={{ fontSize: `${fmt.bodyFontSize}px`, lineHeight: fmt.lineHeightMultiplier, marginBottom: "3px", color: fmt.bodyColor }}>
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
                  <strong style={{ fontSize: `${fmt.bodyFontSize + 0.5}px`, color: fmt.bodyColor }}>{p.title}</strong>
                  {dates && <span style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, color: fmt.accentColor }}>{dates}</span>}
                </div>
                {p.techStack.length > 0 && (
                  <div style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, fontStyle: "italic", color: fmt.accentColor, marginBottom: `${fmt.subItemSpacing ?? 2}px` }}>
                    Technologies: {p.techStack.join(", ")}
                  </div>
                )}
                {bullets.map((b, i) => <Bullet key={i} text={b.trim().replace(/\.$/, "")} />)}
                {(() => {
                  const linkItems: { label: string; url: string }[] = [];
                  if (p.githubLink) linkItems.push({ label: "GitHub", url: p.githubLink });
                  if (p.demoUrl) linkItems.push({ label: "Live_Demo", url: p.demoUrl });
                  if (p.link && p.link !== p.demoUrl) linkItems.push({ label: "Project_Link", url: p.link });
                  if (!linkItems.length) return null;
                  return (
                    <div style={{ fontSize: `${fmt.bodyFontSize - 1}px`, marginTop: "2px" }}>
                      {linkItems.map((li, i) => (
                        <span key={li.label}>
                          {i > 0 && <span style={{ color: fmt.accentColor }}>{"  |  "}</span>}
                          <LinkLabel label={li.label} url={li.url} />
                        </span>
                      ))}
                    </div>
                  );
                })()}
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
                  <strong style={{ fontSize: `${fmt.bodyFontSize + 0.5}px`, color: fmt.bodyColor }}>{e.role}</strong>
                  {dates && <span style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, color: fmt.accentColor }}>{dates}</span>}
                </div>
                <div style={{ fontSize: `${fmt.bodyFontSize}px`, fontStyle: "italic", color: fmt.accentColor, marginBottom: `${fmt.subItemSpacing ?? 2}px` }}>
                  {e.organization}
                </div>
                {e.techStack && e.techStack.length > 0 && (
                  <div style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, fontStyle: "italic", color: fmt.accentColor, marginBottom: `${fmt.subItemSpacing ?? 2}px` }}>
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
                <strong style={{ fontSize: `${fmt.bodyFontSize + 0.5}px`, color: fmt.bodyColor }}>{edu.course}</strong>
                {edu.duration && <span style={{ fontSize: `${fmt.bodyFontSize - 0.5}px`, color: fmt.accentColor }}>{edu.duration}</span>}
              </div>
              <div style={{ fontSize: `${fmt.bodyFontSize}px`, color: fmt.accentColor, marginBottom: `${fmt.subItemSpacing ?? 2}px` }}>{edu.institution}</div>
              {edu.score && <div style={{ fontSize: `${fmt.bodyFontSize}px`, color: fmt.accentColor }}>{edu.score}</div>}
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
        maxWidth: "595px",
        margin: "0 auto",
        padding: px(fmt.marginMM),
        background: "white",
        color: fmt.bodyColor,
        fontFamily,
        fontSize: `${fmt.bodyFontSize}px`,
        lineHeight: fmt.lineHeightMultiplier,
        boxShadow: "0 2px 20px rgba(0,0,0,0.15)",
        borderRadius: "4px",
        minHeight: "842px",
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
          color: fmt.nameColor,
          ...fontStyle(fmt.nameStyle),
        }}>
          {data.name}
        </h1>
        <div style={{ fontSize: `${fmt.bodyFontSize}px`, margin: "4px 0", color: fmt.bodyColor }}>
          {data.role}
        </div>
        <div style={{ fontSize: `${fmt.contactFontSize}px`, color: fmt.accentColor }}>
          {[
            data.email && <LinkLabel key="email" label="Email" url={`mailto:${data.email}`} />,
            data.linkedin && <LinkLabel key="li" label="LinkedIn" url={data.linkedin} />,
            data.github && <LinkLabel key="gh" label="GitHub" url={data.github} />,
          ].filter(Boolean).reduce<React.ReactNode[]>((acc, el, i) => {
            if (i > 0) acc.push(<span key={`sep-${i}`}>{"  |  "}</span>);
            acc.push(el);
            return acc;
          }, [])}
        </div>
      </div>

      {/* Sections */}
      {sectionOrder.map((id) => renderers[id] ? renderers[id]() : null)}
    </div>
  );
}