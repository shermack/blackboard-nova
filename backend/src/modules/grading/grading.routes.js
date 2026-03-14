import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { gradeSubmissionHandler, publishGradesHandler } from "./grading.controller.js";

const router = Router();

router.use(authenticate, authorize("LECTURER", "ADMIN"));
router.patch("/submissions/:submissionId", gradeSubmissionHandler);
router.post("/assignments/:assignmentId/publish", publishGradesHandler);

export default router;
