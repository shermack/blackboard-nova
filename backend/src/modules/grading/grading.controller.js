import { asyncHandler } from "../../utils/asyncHandler.js";
import { gradeSubmission, publishGrades } from "./grading.service.js";

export const gradeSubmissionHandler = asyncHandler(async (req, res) => {
  const submission = await gradeSubmission({
    submissionId: req.params.submissionId,
    graderId: req.user.id,
    ...req.body
  });
  res.json({ submission });
});

export const publishGradesHandler = asyncHandler(async (req, res) => {
  const result = await publishGrades({ assignmentId: req.params.assignmentId });
  res.json(result);
});
