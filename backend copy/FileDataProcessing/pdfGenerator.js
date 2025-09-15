import PDFDocument from "pdfkit";

export function generateAssignmentPDF({
  header = "Document Summary",
  subtitle = "",
  title = "Untitled",
  studentName = "Unknown",
  summary = "",
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text(header, {
        align: "center",
        underline: true,
      });
      doc.moveDown(0.5);

      if (subtitle) {
        doc.fontSize(16).text(subtitle, { align: "center" });
        doc.moveDown(1.5);
      }

      doc.fontSize(14).text("AI Generated Summary", { underline: true });
      doc.moveDown(0.8);

      summary.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
          doc.moveDown(0.3);
          return;
        }

        if (trimmed.startsWith("##")) {
          doc.moveDown(0.5);
          doc.fontSize(13).fillColor("black").text(trimmed.replace(/^##\s*/, ""), {
            align: "left",
          });
          doc.moveDown(0.3);
          return;
        }

        if (/^\*\*.+\*\*$/.test(trimmed)) {
          doc.moveDown(0.4);
          doc.fontSize(12).fillColor("black").text(trimmed.replace(/\*\*/g, ""));
          return;
        }

        if (trimmed.startsWith("* **")) {
          const clean = trimmed.replace(/^\*\s*/, "").replace(/\*\*/g, "");
          doc.fontSize(11).text(`   • ${clean}`, { indent: 30, lineGap: 3 });
          return;
        }
        if (trimmed.startsWith("*")) {
          const clean = trimmed.replace(/^\*\s*/, "");
          doc.fontSize(11).text(`• ${clean}`, { indent: 20, lineGap: 3 });
          return;
        }

        doc.fontSize(11).fillColor("gray").text(trimmed, { lineGap: 3 });
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export default generateAssignmentPDF;
