import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import { generateCourseCode } from "../../utils/generateCourseCode.js";

export const createCourse = async ({ name, description, lecturerId }) => {
  const code = generateCourseCode(name);
  return prisma.course.create({
    data: {
      name,
      description,
      code,
      lecturerId
    }
  });
};

export const joinCourse = async ({ courseCode, studentId }) => {
  const course = await prisma.course.findUnique({ where: { code: courseCode } });
  if (!course) {
    throw new ApiError(404, "Course code not found.");
  }

  return prisma.courseEnrollment.create({
    data: {
      userId: studentId,
      courseId: course.id
    },
    include: {
      course: true
    }
  });
};

export const enrollStudent = async ({ courseId, studentId }) =>
  prisma.courseEnrollment.create({
    data: {
      courseId,
      userId: studentId
    }
  });

export const listCoursesForUser = async (user) => {
  if (user.role === "LECTURER") {
    return prisma.course.findMany({
      where: { lecturerId: user.id },
      include: {
        _count: {
          select: { enrollments: true, assignments: true }
        }
      }
    });
  }

  if (user.role === "STUDENT") {
    return prisma.courseEnrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            _count: {
              select: { assignments: true, enrollments: true }
            }
          }
        }
      }
    });
  }

  return prisma.course.findMany({
    include: {
      lecturer: {
        select: { fullName: true, email: true }
      },
      _count: {
        select: { enrollments: true, assignments: true }
      }
    }
  });
};
