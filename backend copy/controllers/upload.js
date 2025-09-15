import pdf from "pdf-parse";
import Assignment from "../model/assignment.js";
import cleanPdfText from "../FileDataProcessing/pdfCleanUp.js";
import { generateAssignmentPDF } from "../FileDataProcessing/pdfGenerator.js";
import { summarizeText } from "../FileDataProcessing/aiSummaryGenerator.js";
import { searchWeb } from '../FileDataProcessing/webSearch.js';

export async function handleUpload(req, res) {
  return res.send("GET: Hi, I'm upload!");
}


export async function handleUploadFile(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const data = await pdf(req.file.buffer);

    if (!data.text.trim()) {
      return res.status(400).json({
        message: "PDF has no readable text",
        preview: null
      });
    }

    const cleanedText = await cleanPdfText(data.text);

    const summary = await summarizeText(cleanedText);

    const results = await searchWeb("Parallel computing matrix multiplication");
    console.log(results);
    

    const newAssignment = await new Assignment({
      title: req.body.title || "Untitled Assignment",
      studentName: req.body.studentName || "Unknown",
      summary,
    });

    await newAssignment.save();

    const pdfBuffer = await generateAssignmentPDF({
      title: req.body.title,
      studentName: req.body.studentName,
      summary,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=Well_Documented_Assignment.pdf`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Error processing PDF" });
  }
}