import jsPDF from "jspdf";
import { getPortfolioData, getResumeItems, DEFAULT_SECTION_ORDER, DEFAULT_FORMATTING, type ResumeSectionId, type ResumeFormatting } from "./portfolioData";

export async function generateResume(portfolioUrl?: string) {
  const d = getPortfolioData();
  const fmt: ResumeFormatting = { ...DEFAULT_FORMATTING, ...d.resumeFormatting };
  const { projects, internships, certifications, skillCategories } = getResumeItems(d);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const mL = fmt.marginMM;
  const mR = fmt.marginMM;
  const cW = pageWidth - mL - mR;
  let y = 22;

  const setFont = (size: number, style: "normal" | "bold" | "italic" = "normal", color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
  };

  const lineHeight = (size: number) => size * 0.35 * fmt.lineHeightMultiplier;

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - 20) {
      doc.addPage();
      y = 22;
    }
  };

  const addSectionHeading = (title: string) => {
    checkPage(14);
    y += fmt.sectionGapBefore;
    setFont(fmt.headingFontSize, "bold");
    doc.text(title.toUpperCase(), mL, y);
    if (fmt.showSectionLines) {
      y += 1.5;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.line(mL, y, pageWidth - mR, y);
    }
    y += fmt.sectionGapAfter;
  };

  const addBulletPoint = (text: string, indent = mL + 4) => {
    checkPage(8);
    setFont(fmt.bodyFontSize, "normal", [0, 0, 0]);
    const bulletText = `\u2022  ${text}`;
    const lines = doc.splitTextToSize(bulletText, cW - (indent - mL));
    doc.text(lines, indent, y);
    y += lines.length * lineHeight(fmt.bodyFontSize) + fmt.bulletSpacing;
  };

  const addText = (text: string, size?: number, style: "normal" | "bold" | "italic" = "normal", color: [number, number, number] = [0, 0, 0]) => {
    const sz = size ?? fmt.bodyFontSize;
    checkPage(8);
    setFont(sz, style, color);
    const lines = doc.splitTextToSize(text, cW);
    doc.text(lines, mL, y);
    y += lines.length * lineHeight(sz) + fmt.bulletSpacing;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }
    catch { return ""; }
  };

  // ═══════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════
  setFont(fmt.nameFontSize, "bold");
  doc.text(d.name.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 6;

  setFont(fmt.bodyFontSize, "normal", [0, 0, 0]);
  doc.text(d.role, pageWidth / 2, y, { align: "center" });
  y += 5;

  const contactParts: string[] = [];
  if (d.email) contactParts.push(d.email);
  if (d.linkedin) contactParts.push(d.linkedin);
  if (d.github) contactParts.push(d.github);
  if (contactParts.length > 0) {
    setFont(fmt.contactFontSize, "normal", [0, 0, 0]);
    const contactLine = contactParts.join("  |  ");
    const contactLines = doc.splitTextToSize(contactLine, cW);
    contactLines.forEach((line: string) => {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 4;
    });
  }
  y += 2;

  // ═══════════════════════════════════════
  // SECTIONS
  // ═══════════════════════════════════════
  const sectionOrder: ResumeSectionId[] = d.resumeSelections?.sectionOrder || DEFAULT_SECTION_ORDER;

  const catLabels: Record<string, string> = {
    languages: "Programming Languages",
    tools: "Tools & Technologies",
    platforms: "Platforms & IDEs",
    other: "Professional Skills",
  };

  const sectionRenderers: Record<ResumeSectionId, () => void> = {
    summary: () => {
      if (fmt.hiddenSections.includes("summary")) return;
      addSectionHeading("Professional Summary");
      addText(d.intro);
    },
    skills: () => {
      if (fmt.hiddenSections.includes("skills")) return;
      addSectionHeading("Skills");
      skillCategories.forEach((cat) => {
        const skills = d.skills[cat];
        if (skills && skills.length > 0) {
          checkPage(8);
          setFont(10.5, "bold", [0, 0, 0]);
          const label = `${catLabels[cat] || cat}: `;
          const labelW = doc.getTextWidth(label);
          doc.text(label, mL, y);
          setFont(10.5, "normal", [0, 0, 0]);
          const valLines = doc.splitTextToSize(skills.join(", "), cW - labelW);
          doc.text(valLines, mL + labelW, y);
          y += valLines.length * lineHeight(10.5) + 2.5;
        }
      });
    },
    projects: () => {
      if (projects.length === 0) return;
      addSectionHeading("Projects");
      projects.forEach((p, idx) => {
        checkPage(14);
        setFont(11, "bold", [0, 0, 0]);
        doc.text(p.title, mL, y);
        const pDates = [p.startDate && formatDate(p.startDate), p.endDate && formatDate(p.endDate)].filter(Boolean).join(" - ") || (p.singleDate ? formatDate(p.singleDate) : "");
        if (pDates) {
          setFont(10, "normal", [0, 0, 0]);
          doc.text(pDates, pageWidth - mR, y, { align: "right" });
        }
        y += 5;
        if (p.techStack.length > 0) {
          setFont(10, "italic", [0, 0, 0]);
          doc.text(`Technologies: ${p.techStack.join(", ")}`, mL, y);
          y += 4.5;
        }
        const descBullets = p.description.split(/\.\s*/).filter(s => s.trim().length > 0);
        descBullets.forEach((bullet) => {
          addBulletPoint(bullet.trim().replace(/\.$/, ""));
        });
        if (p.githubLink) {
          setFont(9, "normal", [0, 0, 0]);
          doc.text(`GitHub: ${p.githubLink}`, mL + 4, y);
          y += 4;
        }
        if (p.demoUrl || p.link) {
          setFont(9, "normal", [0, 0, 0]);
          doc.text(`Link: ${p.demoUrl || p.link}`, mL + 4, y);
          y += 4;
        }
        if (idx < projects.length - 1) y += 3;
      });
    },
    experience: () => {
      if (internships.length === 0) return;
      addSectionHeading("Work Experience");
      internships.forEach((e, idx) => {
        checkPage(14);
        setFont(11, "bold", [0, 0, 0]);
        doc.text(e.role, mL, y);
        const dates = [e.startDate && formatDate(e.startDate), e.endDate && formatDate(e.endDate)].filter(Boolean).join(" - ") || (e.singleDate ? formatDate(e.singleDate) : "") || e.duration;
        if (dates) {
          setFont(10, "normal", [0, 0, 0]);
          doc.text(dates, pageWidth - mR, y, { align: "right" });
        }
        y += 5;
        setFont(10.5, "italic", [0, 0, 0]);
        doc.text(e.organization, mL, y);
        y += 4.5;
        const respBullets = e.responsibilities.split(/\.\s*/).filter(s => s.trim().length > 0);
        respBullets.forEach((bullet) => {
          addBulletPoint(bullet.trim().replace(/\.$/, ""));
        });
        if (idx < internships.length - 1) y += 3;
      });
    },
    certifications: () => {
      if (certifications.length === 0) return;
      addSectionHeading("Certifications");
      certifications.forEach((c) => {
        addBulletPoint(`${c.title} — ${c.platform}${c.date ? ` (${c.date})` : ""}`);
      });
    },
    education: () => {
      if (!d.education || d.education.length === 0) return;
      addSectionHeading("Education");
      d.education.forEach((edu, idx) => {
        checkPage(12);
        setFont(11, "bold", [0, 0, 0]);
        doc.text(edu.course, mL, y);
        y += 5;
        setFont(10.5, "normal", [0, 0, 0]);
        doc.text(edu.institution, mL, y);
        if (edu.duration) {
          setFont(10, "normal", [0, 0, 0]);
          doc.text(edu.duration, pageWidth - mR, y, { align: "right" });
        }
        y += 4.5;
        if (edu.score) {
          setFont(10, "normal", [0, 0, 0]);
          doc.text(edu.score, mL, y);
          y += 4.5;
        }
        if (idx < d.education.length - 1) y += 2;
      });
    },
    achievements: () => {
      if (!d.achievements || d.achievements.length === 0) return;
      addSectionHeading("Achievements");
      d.achievements.forEach((a) => {
        addBulletPoint(a);
      });
    },
  };

  sectionOrder.forEach((sectionId) => {
    if (sectionRenderers[sectionId]) {
      sectionRenderers[sectionId]();
    }
  });

  doc.save(`${d.name.replace(/\s+/g, "_")}_Resume.pdf`);
}

// Load image as data URL for embedding in PDF
async function loadImageAsDataURL(url: string): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    return await new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.8), width: img.width, height: img.height });
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  } catch { return null; }
}

// Generate a detailed project report PDF
export async function generateProjectPDF(projectId: string) {
  const d = getPortfolioData();
  const p = d.projects.find((proj) => proj.id === projectId);
  if (!p) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addSection = (title: string) => {
    y += 4;
    doc.setDrawColor(80, 80, 80);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(title, margin, y);
    y += 6;
  };

  const addText = (text: string, size = 9, color: [number, number, number] = [40, 40, 40]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * (size * 0.4 + 1);
  };

  const checkPage = (needed: number) => {
    if (y + needed > 280) { doc.addPage(); y = 20; }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }); } catch { return ""; }
  };

  // === Title ===
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 10);
  doc.text(p.title, margin, y);
  y += 10;

  // === Date ===
  const dates = [p.startDate && formatDate(p.startDate), p.endDate && formatDate(p.endDate)].filter(Boolean).join(" – ") || (p.singleDate ? formatDate(p.singleDate) : "");
  if (dates) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${dates}`, margin, y);
    y += 6;
  }

  if (p.featured) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("★ Featured Project", margin, y);
    y += 6;
  }

  // === Thumbnail ===
  if (p.thumbnail) {
    checkPage(60);
    const imgData = await loadImageAsDataURL(p.thumbnail);
    if (imgData) {
      const maxW = contentWidth;
      const maxH = 50;
      const ratio = Math.min(maxW / imgData.width, maxH / imgData.height);
      const w = imgData.width * ratio;
      const h = imgData.height * ratio;
      doc.addImage(imgData.dataUrl, "JPEG", margin, y, w, h);
      y += h + 4;
    }
  }

  // === Description ===
  addSection("Description");
  addText(p.description);

  // === Key Features ===
  if (p.keyFeatures && p.keyFeatures.length > 0) {
    checkPage(20);
    addSection("Key Features");
    p.keyFeatures.forEach((f) => { addText(`• ${f}`); });
  }

  // === Tech Stack ===
  if (p.techStack.length > 0) {
    checkPage(15);
    addSection("Tech Stack");
    addText(p.techStack.join(", "));
  }

  // === Skills You May Learn ===
  if (p.skillsToLearn && p.skillsToLearn.length > 0) {
    checkPage(15);
    addSection("Skills You May Learn");
    addText(p.skillsToLearn.join(", "));
  }

  // === Motivation ===
  if (p.motivation) {
    checkPage(15);
    addSection("Motivation / Reason");
    const motText = p.motivation === "Other" && p.motivationOther ? p.motivationOther : p.motivation;
    addText(motText);
  }

  // === Links ===
  checkPage(25);
  addSection("Links");
  if (p.demoUrl) { addText(`Demo / Try Out: ${p.demoUrl}`, 9, [0, 80, 180]); }
  if (p.link) { addText(`Project Link: ${p.link}`, 9, [0, 80, 180]); }
  if (p.githubLink) { addText(`GitHub: ${p.githubLink}`, 9, [0, 80, 180]); }

  // === Screenshots ===
  const screenshots = [...(p.screenshots || []), ...(p.images || [])];
  if (screenshots.length > 0) {
    checkPage(20);
    addSection("Screenshots");
    for (const url of screenshots) {
      checkPage(60);
      const imgData = await loadImageAsDataURL(url);
      if (imgData) {
        const maxW = contentWidth;
        const maxH = 55;
        const ratio = Math.min(maxW / imgData.width, maxH / imgData.height);
        const w = imgData.width * ratio;
        const h = imgData.height * ratio;
        doc.addImage(imgData.dataUrl, "JPEG", margin, y, w, h);
        y += h + 4;
      }
    }
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated from ${d.name}'s Portfolio`, margin, 285);

  doc.save(`${p.title.replace(/\s+/g, "_")}_Report.pdf`);
}
