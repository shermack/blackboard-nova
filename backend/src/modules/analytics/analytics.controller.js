import { asyncHandler } from "../../utils/asyncHandler.js";
import { getDashboardAnalytics } from "./analytics.service.js";

export const dashboardAnalyticsHandler = asyncHandler(async (req, res) => {
  const analytics = await getDashboardAnalytics(req.user);
  res.json(analytics);
});
