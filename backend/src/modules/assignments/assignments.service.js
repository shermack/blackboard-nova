import { prisma } from "../../config/prisma.js";
import { submissionAnalysisQueue } from "../../config/queue.js";
import { ApiError } from "../../utils/apiError.js";
import {
  buildSubmissionStorageKey,
  uploadBufferToStorage
} from "../../services/storage.service.js";

export const createAssignment = async ({
  title,
  description,
  deadline,
  maxMarks,
  courseId,
  createdById
}) =>
  prisma.assignment.create({
    data: {
      title,
      description,
      deadline: new Date(deadline),
      maxMarks: Number(maxMarks),
      courseId,
      createdById,
      allowedTypes: ["PDF", "DOCX", "ZIP"]
    }
  });

export const listAssignmentsForUser = async (user) => {
  if (user.role === "LECTURER") {
    return prisma.assignment.findMany({
      where: { createdById: user.id },
      include: {
        course: true,
        submissions: {
          include: {
            student: { select: { fullName: true, email: true } }
          }
        }
      }
    });
  }

  if (user.role === "STUDENT") {
    return prisma.assignment.findMany({
      where: {
        course: {
          enrollments: {
            some: { userId: user.id }
          }
        }
      },
      include: {
        course: true,
        submissions: {
          where: { studentId: user.id }
        }
      }
    });
  }

  return prisma.assignment.findMany({
    include: {
      course: true,
      submissions: true
    }
  });
};

export const submitAssignment = async ({ assignmentId, studentId, file }) => {
  if (!file) {
    throw new ApiError(400, "Submission file is required.");
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { course: true }
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  const fileName = `${studentId}-${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
  const storageKey = buildSubmissionStorageKey({
    courseId: assignment.courseId,
    assignmentId,
    fileName
  });

  await uploadBufferToStorage({
    key: storageKey,
    body: file.buffer,
    contentType: file.mimetype
  });

  const submission = await prisma.submission.create({
    data: {
      assignmentId,
      studentId,
      originalFileName: file.originalname,
      storageKey,
      mimeType: file.mimetype
    }
  });

  await submissionAnalysisQueue.add("analyze-submission", {
    submissionId: submission.id,
    fileBufferBase64: file.buffer.toString("base64")
  });

  return submission;
};

export const getAssignmentGradingTable = async (assignmentId) =>
  prisma.submission.findMany({
    where: { assignmentId },
    include: {
      student: {
        select: { fullName: true, email: true }
      }
    },
    orderBy: [{ suspicious: "desc" }, { submittedAt: "asc" }]
  });
