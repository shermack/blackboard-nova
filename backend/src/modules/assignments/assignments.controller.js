import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createAssignment,
  getAssignmentGradingTable,
  listAssignmentsForUser,
  submitAssignment
} from "./assignments.service.js";

export const createAssignmentHandler = asyncHandler(async (req, res) => {
  const assignment = await createAssignment({
    ...req.body,
    createdById: req.user.id
  });
  res.status(201).json({ assignment });
});

export const listAssignmentsHandler = asyncHandler(async (req, res) => {
  const assignments = await listAssignmentsForUser(req.user);
  res.json({ assignments });
});

export const submitAssignmentHandler = asyncHandler(async (req, res) => {
  const submission = await submitAssignment({
    assignmentId: req.params.assignmentId,
    studentId: req.user.id,
    file: req.file
  });
  res.status(201).json({ submission });
});

export const gradingTableHandler = asyncHandler(async (req, res) => {
  const rows = await getAssignmentGradingTable(req.params.assignmentId);
  res.json({ rows });
});
