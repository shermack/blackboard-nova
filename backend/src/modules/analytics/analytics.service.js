import { prisma } from "../../config/prisma.js";

export const getDashboardAnalytics = async (user) => {
  const courseFilter =
    user.role === "LECTURER"
      ? { lecturerId: user.id }
      : user.role === "STUDENT"
        ? { enrollments: { some: { userId: user.id } } }
        : {};

  const [courses, assignments, submissions] = await Promise.all([
    prisma.course.findMany({ where: courseFilter }),
    prisma.assignment.findMany({
      where: {
        course: courseFilter
      }
    }),
    prisma.submission.findMany({
      where:
        user.role === "STUDENT"
          ? { studentId: user.id }
          : user.role === "LECTURER"
            ? { assignment: { course: { lecturerId: user.id } } }
            : {}
    })
  ]);

  const gradeDistribution = [
    { range: "0-39", count: submissions.filter((item) => (item.grade ?? 0) < 40).length },
    { range: "40-59", count: submissions.filter((item) => (item.grade ?? 0) >= 40 && (item.grade ?? 0) < 60).length },
    { range: "60-79", count: submissions.filter((item) => (item.grade ?? 0) >= 60 && (item.grade ?? 0) < 80).length },
    { range: "80-100", count: submissions.filter((item) => (item.grade ?? 0) >= 80).length }
  ];

  const averageGrade =
    submissions.reduce((sum, item) => sum + (item.grade ?? 0), 0) / (submissions.length || 1);

  const submissionRate = assignments.length
    ? Number(((submissions.length / assignments.length) * 100).toFixed(2))
    : 0;

  return {
    summary: {
      courses: courses.length,
      assignments: assignments.length,
      submissions: submissions.length,
      averageGrade: Number(averageGrade.toFixed(2)),
      submissionRate
    },
    gradeDistribution,
    submissionTrend: assignments.map((assignment) => ({
      assignment: assignment.title,
      submitted: submissions.filter((item) => item.assignmentId === assignment.id).length
    }))
  };
};
