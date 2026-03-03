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
  const mL = 16; // left margin
  const mR = 16; // right margin
  const cW = pageWidth - mL - mR; // content width
  let y = 18;

  // ── Helpers ──
  const setFont = (size: number, bold = false, color: [number, number, number] = [30, 30, 30]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
  };

  const addWrapped = (text: string, size: number, indent: number, maxW: number, color: [number, number, number] = [45, 45, 45]) => {
    setFont(size, false, color);
    const lines = doc.splitTextToSize(text, maxW);
    doc.text(lines, indent, y);
    y += lines.length * (size * 0.45 + 1);
  };

  const addBullet = (text: string, size: number, indent = mL) => {
    setFont(size, false, [45, 45, 45]);
    const textX = indent + 5;
    const lines = doc.splitTextToSize(text, cW - 5);
    doc.text("•", indent + 1, y);
    doc.text(lines, textX, y);
    y += lines.length * (size * 0.45 + 1);
  };

  const addSectionHeader = (title: string) => {
    y += 5;
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.5);
    doc.line(mL, y, pageWidth - mR, y);
    y += 6;
    setFont(11.5, true, [10, 10, 10]);
    doc.text(title.toUpperCase(), mL, y);
    y += 7;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }
    catch { return ""; }
  };

  // ════════════════════════════════════════════
  // 1. NAME & CONTACT
  // ════════════════════════════════════════════
  setFont(22, true, [10, 10, 10]);
  doc.text(d.name, mL, y);
  y += 8;

  setFont(11, false, [60, 60, 60]);
  doc.text(d.role, mL, y);
  y += 6;

  // Contact line
  const contactParts: string[] = [];
  if (d.email) contactParts.push(d.email);
  if (d.linkedin) contactParts.push(`LinkedIn: ${d.linkedin}`);
  if (d.github) contactParts.push(`GitHub: ${d.github}`);
  setFont(8, false, [80, 80, 80]);
  const contactText = contactParts.join("  |  ");
  const contactLines = doc.splitTextToSize(contactText, cW);
  doc.text(contactLines, mL, y);
  y += contactLines.length * 4;

  // ════════════════════════════════════════════
  // 2. PROFESSIONAL SUMMARY
  // ════════════════════════════════════════════
  addSectionHeader("Professional Summary");
  addWrapped(d.intro, 9.5, mL, cW);

  // ════════════════════════════════════════════
  // 3. TECHNICAL SKILLS (bullet points)
  // ════════════════════════════════════════════
  addSectionHeader("Technical Skills");
  const levels = d.skillLevels || {};
  const formatSkill = (s: string) => levels[s] ? `${s} (${levels[s]})` : s;

  skillCategories.forEach((cat) => {
    const skills = d.skills[cat];
    if (skills && skills.length > 0) {
      const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
      addBullet(`${catLabel}: ${skills.map(formatSkill).join(", ")}`, 9);
      y += 1;
    }
  });

  // ════════════════════════════════════════════
  // 4. PROJECTS (with links below title)
  // ════════════════════════════════════════════
  if (projects.length > 0) {
    addSectionHeader("Projects");
    projects.forEach((p, idx) => {
      // Project title (bold) + date right-aligned
      setFont(10.5, true, [15, 15, 15]);
      const titleText = `${p.title}${p.featured ? "  ★" : ""}`;
      doc.text(titleText, mL, y);
      const pDates = [p.startDate && formatDate(p.startDate), p.endDate && formatDate(p.endDate)].filter(Boolean).join(" – ") || (p.singleDate ? formatDate(p.singleDate) : "");
      if (pDates) {
        setFont(8, false, [90, 90, 90]);
        doc.text(pDates, pageWidth - mR, y, { align: "right" });
      }
      y += 5;

      // Links row (GitHub / Demo) in blue
      if (p.githubLink || p.demoUrl || p.link) {
        const linkParts: string[] = [];
        if (p.githubLink) linkParts.push(`GitHub: ${p.githubLink}`);
        if (p.demoUrl) linkParts.push(`Live Demo: ${p.demoUrl}`);
        else if (p.link) linkParts.push(`Link: ${p.link}`);
        setFont(8, false, [0, 60, 150]);
        doc.text(linkParts.join("   |   "), mL + 3, y);
        y += 4.5;
      }

      // Description
      addWrapped(p.description, 9, mL + 3, cW - 3);

      // Tech stack
      if (p.techStack.length > 0) {
        setFont(8, false, [80, 80, 80]);
        doc.text(`Tech: ${p.techStack.join(", ")}`, mL + 3, y);
        y += 4;
      }

      if (idx < projects.length - 1) y += 3;
    });
  }

  // ════════════════════════════════════════════
  // 5. TRAINING / INTERNSHIPS
  // ════════════════════════════════════════════
  if (internships.length > 0) {
    addSectionHeader("Training / Internships");
    internships.forEach((e, idx) => {
      setFont(10.5, true, [15, 15, 15]);
      doc.text(`${e.role} — ${e.organization}`, mL, y);
      const dates = [e.startDate && formatDate(e.startDate), e.endDate && formatDate(e.endDate)].filter(Boolean).join(" – ") || (e.singleDate ? formatDate(e.singleDate) : "");
      const durationStr = dates || e.duration;
      if (durationStr) {
        setFont(8, false, [90, 90, 90]);
        doc.text(durationStr, pageWidth - mR, y, { align: "right" });
      }
      y += 5;
      addWrapped(e.responsibilities, 9, mL + 3, cW - 3);
      if (idx < internships.length - 1) y += 2;
    });
  }

  // ════════════════════════════════════════════
  // 6. CERTIFICATES
  // ════════════════════════════════════════════
  if (certifications.length > 0) {
    addSectionHeader("Certificates");
    certifications.forEach((c) => {
      addBullet(`${c.title} — ${c.platform}${c.date ? ` (${c.date})` : ""}`, 9);
      y += 1;
    });
  }

  // ════════════════════════════════════════════
  // QR Code (bottom-right corner)
  // ════════════════════════════════════════════
  const url = portfolioUrl || window.location.origin;
  try {
    const qrDataUrl = await generateQRDataURL(url);
    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120);
    doc.text("Portfolio:", pageWidth - 32, pageHeight - 20);
    doc.addImage(qrDataUrl, "PNG", pageWidth - 30, pageHeight - 19, 16, 16);
  } catch {
    // skip
  }

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
