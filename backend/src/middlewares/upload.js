import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed"
];

export const uploadSubmission = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new ApiError(400, "Only PDF, DOCX and ZIP files are allowed."));
      return;
    }

    callback(null, true);
  }
});
