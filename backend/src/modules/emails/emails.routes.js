import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { createBulkEmailHandler } from "./emails.controller.js";

const router = Router();

router.use(authenticate, authorize("LECTURER", "ADMIN"));
router.post("/bulk", createBulkEmailHandler);

export default router;
