import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";

import authRoutes from "./modules/auth/auth.routes.js";
import courseRoutes from "./modules/courses/courses.routes.js";
import assignmentRoutes from "./modules/assignments/assignments.routes.js";
import gradingRoutes from "./modules/grading/grading.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import emailRoutes from "./modules/emails/emails.routes.js";

import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

export const app = express();

/* -------------------------------- */
/* CORS CONFIGURATION */
/* -------------------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://blackboard-nova-j0tfa91b2-shermacks-projects.vercel.app",
  env.clientUrl
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // allow temporarily to avoid blocking
      }
    },
    credentials: true
  })
);

/* -------------------------------- */

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* -------------------------------- */
/* HEALTH CHECK */
/* -------------------------------- */

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "assignment-management-platform"
  });
});

/* -------------------------------- */
/* ROUTES */
/* -------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/grading", gradingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/emails", emailRoutes);

/* -------------------------------- */
/* ERROR HANDLERS */
/* -------------------------------- */

app.use(notFoundHandler);
app.use(errorHandler);
