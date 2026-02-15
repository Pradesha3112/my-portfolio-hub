import jsPDF from "jspdf";
import { getPortfolioData, getResumeItems } from "./portfolioData";

async function generateQRDataURL(text: string): Promise<string> {
  const QRCode = await import("qrcode");
  return QRCode.toDataURL(text, { width: 80, margin: 1 });
}

export async function generateResume(portfolioUrl?: string) {
  const d = getPortfolioData();
  const { projects, internships, certifications, skillCategories } = getResumeItems(d);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 14;

  const addLine = (text: string, size = 9, bold = false, color: [number, number, number] = [30, 30, 30]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    doc.text(text, 14, y);
    y += size * 0.42 + 1.5;
  };

  const addWrapped = (text: string, size = 8, maxWidth = pageWidth - 28) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, 14, y);
    y += lines.length * (size * 0.38 + 1);
  };

  const addSectionHeader = (title: string) => {
    y += 2;
    doc.setDrawColor(80, 80, 80);
    doc.line(14, y, pageWidth - 14, y);
    y += 4;
    addLine(title, 10, true, [20, 20, 20]);
    y += 1;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }
    catch { return ""; }
  };

  // === NAME & CONTACT ===
  addLine(d.name, 18, true, [10, 10, 10]);
  addLine(d.role, 10, false, [80, 80, 80]);
  y += 1;
  addLine(`${d.email}  |  LinkedIn: ${d.linkedin}  |  GitHub: ${d.github}`, 7, false, [100, 100, 100]);

  // === PROFESSIONAL SUMMARY ===
  addSectionHeader("PROFESSIONAL SUMMARY");
  addWrapped(d.intro, 8);

  // === TECHNICAL SKILLS ===
  addSectionHeader("TECHNICAL SKILLS");
  const levels = d.skillLevels || {};
  const formatSkill = (s: string) => levels[s] ? `${s} (${levels[s]})` : s;

  skillCategories.forEach((cat) => {
    const skills = d.skills[cat];
    if (skills.length > 0) {
      const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
      addLine(`${catLabel}: ${skills.map(formatSkill).join(", ")}`, 8);
    }
  });

  // === PROJECTS ===
  if (projects.length > 0) {
    addSectionHeader("PROJECTS");
    projects.forEach((p) => {
      addLine(`${p.title}${p.featured ? " ★" : ""}`, 9, true);
      const pDates = [p.startDate && formatDate(p.startDate), p.endDate && formatDate(p.endDate)].filter(Boolean).join(" – ") || (p.singleDate ? formatDate(p.singleDate) : "");
      if (pDates) addLine(pDates, 7, false, [100, 100, 100]);
      addWrapped(p.description, 8);
      if (p.techStack.length > 0) addLine(`Tech: ${p.techStack.join(", ")}`, 7, false, [100, 100, 100]);
      y += 1;
    });
  }

  // === TRAINING / INTERNSHIPS ===
  if (internships.length > 0) {
    addSectionHeader("TRAINING / INTERNSHIPS");
    internships.forEach((e) => {
      addLine(`${e.role} — ${e.organization}`, 9, true);
      const dates = [e.startDate && formatDate(e.startDate), e.endDate && formatDate(e.endDate)].filter(Boolean).join(" – ") || (e.singleDate ? formatDate(e.singleDate) : "");
      const durationStr = dates || e.duration;
      if (durationStr) addLine(durationStr, 7, false, [100, 100, 100]);
      addWrapped(e.responsibilities, 8);
      y += 1;
    });
  }

  // === CERTIFICATES ===
  if (certifications.length > 0) {
    addSectionHeader("CERTIFICATES");
    certifications.forEach((c) => {
      addLine(`${c.title} — ${c.platform}${c.date ? ` (${c.date})` : ""}`, 8);
    });
  }

  // === QR CODE (bottom-right) ===
  const url = portfolioUrl || window.location.origin;
  try {
    const qrDataUrl = await generateQRDataURL(url);
    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120);
    doc.text("Scan for portfolio:", pageWidth - 38, pageHeight - 22);
    doc.addImage(qrDataUrl, "PNG", pageWidth - 34, pageHeight - 20, 18, 18);
  } catch {
    // QR generation failed, skip
  }

  doc.save(`${d.name.replace(/\s+/g, "_")}_Resume.pdf`);
}

// Generate a single project summary PDF
export async function generateProjectPDF(projectId: string) {
  const d = getPortfolioData();
  const p = d.projects.find((proj) => proj.id === projectId);
  if (!p) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 10);
  doc.text(p.title, 15, y);
  y += 10;

  if (p.featured) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("★ Featured Project", 15, y);
    y += 6;
  }

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }); } catch { return ""; }
  };

  const dates = [p.startDate && formatDate(p.startDate), p.endDate && formatDate(p.endDate)].filter(Boolean).join(" – ") || (p.singleDate ? formatDate(p.singleDate) : "");
  if (dates) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(dates, 15, y);
    y += 8;
  }

  doc.setDrawColor(80, 80, 80);
  doc.line(15, y, pageWidth - 15, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  const lines = doc.splitTextToSize(p.description, pageWidth - 30);
  doc.text(lines, 15, y);
  y += lines.length * 5 + 6;

  if (p.techStack.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Tech Stack:", 15, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(p.techStack.join(", "), 15, y);
    y += 8;
  }

  if (p.link) {
    doc.setFontSize(9);
    doc.setTextColor(0, 100, 200);
    doc.text(`Link: ${p.link}`, 15, y);
    y += 6;
  }

  if (p.demoUrl) {
    doc.setFontSize(9);
    doc.setTextColor(0, 100, 200);
    doc.text(`Live Demo: ${p.demoUrl}`, 15, y);
    y += 6;
  }

  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated from ${d.name}'s Portfolio`, 15, 285);

  doc.save(`${p.title.replace(/\s+/g, "_")}_Summary.pdf`);
}
