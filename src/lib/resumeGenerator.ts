import jsPDF from "jspdf";
import { getPortfolioData } from "./portfolioData";

export function generateResume() {
  const d = getPortfolioData();
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addLine = (text: string, size = 10, bold = false, color: [number, number, number] = [30, 30, 30]) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    doc.text(text, 15, y);
    y += size * 0.5 + 2;
  };

  const addWrapped = (text: string, size = 10) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, pageWidth - 30);
    doc.text(lines, 15, y);
    y += lines.length * (size * 0.45 + 1.5);
  };

  const addSectionHeader = (title: string) => {
    y += 4;
    doc.setDrawColor(60, 60, 60);
    doc.line(15, y, pageWidth - 15, y);
    y += 6;
    addLine(title, 13, true, [20, 20, 20]);
    y += 2;
  };

  // Header
  addLine(d.name, 22, true, [10, 10, 10]);
  addLine(d.role, 12, false, [80, 80, 80]);
  y += 2;
  addLine(`${d.email}  |  LinkedIn: ${d.linkedin}  |  GitHub: ${d.github}`, 8, false, [100, 100, 100]);
  y += 2;
  addWrapped(d.intro, 9);

  // Education
  addSectionHeader("EDUCATION");
  d.education.forEach((e) => {
    addLine(`${e.course}`, 10, true);
    addLine(`${e.institution}`, 9, false, [80, 80, 80]);
    addLine(`${e.duration}  •  ${e.score}`, 8, false, [100, 100, 100]);
    y += 2;
  });

  // Experience
  if (d.internships.length > 0) {
    addSectionHeader("EXPERIENCE");
    d.internships.forEach((e) => {
      addLine(`${e.role} — ${e.organization}`, 10, true);
      addLine(e.duration, 8, false, [100, 100, 100]);
      addWrapped(e.responsibilities, 9);
      y += 2;
    });
  }

  // Projects
  addSectionHeader("PROJECTS");
  d.projects.forEach((p) => {
    addLine(`${p.title}${p.featured ? " ★" : ""}`, 10, true);
    addWrapped(p.description, 9);
    if (p.techStack.length > 0) {
      addLine(`Tech: ${p.techStack.join(", ")}`, 8, false, [100, 100, 100]);
    }
    y += 2;
  });

  // Skills
  addSectionHeader("SKILLS");
  addLine(`Languages: ${d.skills.languages.join(", ")}`, 9);
  addLine(`Tools: ${d.skills.tools.join(", ")}`, 9);
  addLine(`Platforms: ${d.skills.platforms.join(", ")}`, 9);
  addLine(`Other: ${d.skills.other.join(", ")}`, 9);

  // Certifications
  if (d.certifications.length > 0) {
    addSectionHeader("CERTIFICATIONS");
    d.certifications.forEach((c) => {
      addLine(`${c.title} — ${c.platform}${c.date ? ` (${c.date})` : ""}`, 9);
    });
  }

  // Achievements
  if (d.achievements.length > 0) {
    addSectionHeader("ACHIEVEMENTS");
    d.achievements.forEach((a) => {
      addLine(`• ${a}`, 9);
    });
  }

  doc.save(`${d.name.replace(/\s+/g, "_")}_Resume.pdf`);
}
