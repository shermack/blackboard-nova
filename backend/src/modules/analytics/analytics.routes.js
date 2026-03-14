import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { dashboardAnalyticsHandler } from "./analytics.controller.js";

const router = Router();

router.use(authenticate);
router.get("/dashboard", dashboardAnalyticsHandler);

export default router;
