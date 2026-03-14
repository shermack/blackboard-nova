import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import {
  createCourseHandler,
  enrollStudentHandler,
  joinCourseHandler,
  listCoursesHandler
} from "./courses.controller.js";

const router = Router();

router.use(authenticate);
router.get("/", listCoursesHandler);
router.post("/", authorize("LECTURER", "ADMIN"), createCourseHandler);
router.post("/join", authorize("STUDENT"), joinCourseHandler);
router.post("/:courseId/enroll", authorize("LECTURER", "ADMIN"), enrollStudentHandler);

export default router;
