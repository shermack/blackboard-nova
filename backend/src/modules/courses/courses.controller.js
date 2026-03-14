import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createCourse,
  enrollStudent,
  joinCourse,
  listCoursesForUser
} from "./courses.service.js";

export const createCourseHandler = asyncHandler(async (req, res) => {
  const course = await createCourse({
    ...req.body,
    lecturerId: req.user.id
  });
  res.status(201).json({ course });
});

export const joinCourseHandler = asyncHandler(async (req, res) => {
  const enrollment = await joinCourse({
    courseCode: req.body.courseCode,
    studentId: req.user.id
  });
  res.status(201).json({ enrollment });
});

export const enrollStudentHandler = asyncHandler(async (req, res) => {
  const enrollment = await enrollStudent({
    courseId: req.params.courseId,
    studentId: req.body.studentId
  });
  res.status(201).json({ enrollment });
});

export const listCoursesHandler = asyncHandler(async (req, res) => {
  const courses = await listCoursesForUser(req.user);
  res.json({ courses });
});
