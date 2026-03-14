import { prisma } from "../../config/prisma.js";
import { buildGradesPdf, buildGradesWorkbook } from "../../services/export.service.js";

export const gradeSubmission = async ({ submissionId, graderId, grade, feedback }) =>
  prisma.submission.update({
    where: { id: submissionId },
    data: {
      graderId,
      grade: Number(grade),
      feedback,
      status: "GRADED"
    }
  });

export const publishGrades = async ({ assignmentId }) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { title: true }
  });

  const submissions = await prisma.submission.findMany({
    where: { assignmentId },
    include: {
      student: { select: { fullName: true } }
    }
  });

  const grades = submissions.map((item) => item.grade ?? 0);
  const average = grades.reduce((sum, value) => sum + value, 0) / (grades.length || 1);
  const topScore = Math.max(...grades, 0);
  const lowestScore = grades.length ? Math.min(...grades) : 0;
  const rows = submissions.map((item) => ({
    student: item.student.fullName,
    aiScore: item.aiScore,
    similarityScore: item.similarityScore,
    file: item.originalFileName,
    grade: item.grade,
    feedback: item.feedback
  }));

  const [excelBuffer, pdfBuffer] = await Promise.all([
    buildGradesWorkbook({ assignmentTitle: assignment?.title || assignmentId, rows }),
    buildGradesPdf({
      assignmentTitle: assignment?.title || assignmentId,
      rows,
      metrics: { average, topScore, lowestScore }
    })
  ]);

  const publication = await prisma.gradePublication.upsert({
    where: { assignmentId },
    update: { average, topScore, lowestScore },
    create: { assignmentId, average, topScore, lowestScore }
  });

  return {
    publication,
    metrics: { average, topScore, lowestScore },
    topStudents: submissions
      .sort((a, b) => (b.grade ?? 0) - (a.grade ?? 0))
      .slice(0, 3)
      .map((item) => ({ student: item.student.fullName, grade: item.grade ?? 0 })),
    exports: {
      excelBase64: excelBuffer.toString("base64"),
      pdfBase64: pdfBuffer.toString("base64")
    }
  };
};
