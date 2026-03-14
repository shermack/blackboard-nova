import { asyncHandler } from "../../utils/asyncHandler.js";
import { createBulkEmailCampaign } from "./emails.service.js";

export const createBulkEmailHandler = asyncHandler(async (req, res) => {
  const result = await createBulkEmailCampaign({
    senderId: req.user.id,
    ...req.body
  });
  res.status(201).json(result);
});
