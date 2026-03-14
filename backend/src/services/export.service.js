import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const buildGradesWorkbook = async ({ assignmentTitle, rows }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Grades");

  worksheet.columns = [
    { header: "Student", key: "student", width: 28 },
    { header: "AI Score", key: "aiScore", width: 12 },
    { header: "Similarity", key: "similarityScore", width: 12 },
    { header: "File", key: "file", width: 36 },
    { header: "Grade", key: "grade", width: 10 },
    { header: "Feedback", key: "feedback", width: 48 }
  ];

  rows.forEach((row) => worksheet.addRow(row));
  worksheet.getRow(1).font = { bold: true };
  workbook.creator = "Assignment Management Platform";
  workbook.subject = assignmentTitle;

  return workbook.xlsx.writeBuffer();
};

export const buildGradesPdf = ({ assignmentTitle, rows, metrics }) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 36 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(20).text(`${assignmentTitle} Grade Sheet`);
    doc.moveDown();
    doc.fontSize(11).text(`Average: ${metrics.average.toFixed(2)}`);
    doc.text(`Top score: ${metrics.topScore.toFixed(2)}`);
    doc.text(`Lowest score: ${metrics.lowestScore.toFixed(2)}`);
    doc.moveDown();

    rows.forEach((row) => {
      doc.text(
        `${row.student} | Grade: ${row.grade ?? "-"} | AI: ${row.aiScore}% | Similarity: ${row.similarityScore}%`
      );
      if (row.feedback) {
        doc.fillColor("#6b7280").text(`Feedback: ${row.feedback}`).fillColor("#111827");
      }
      doc.moveDown(0.5);
    });

    doc.end();
  });
