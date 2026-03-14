import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { uploadSubmission } from "../../middlewares/upload.js";
import {
  createAssignmentHandler,
  gradingTableHandler,
  listAssignmentsHandler,
  submitAssignmentHandler
} from "./assignments.controller.js";

const router = Router();

router.use(authenticate);
router.get("/", listAssignmentsHandler);
router.post("/", authorize("LECTURER", "ADMIN"), createAssignmentHandler);
router.get("/:assignmentId/grading-table", authorize("LECTURER", "ADMIN"), gradingTableHandler);
router.post(
  "/:assignmentId/submissions",
  authorize("STUDENT"),
  uploadSubmission.single("file"),
  submitAssignmentHandler
);

export default router;
