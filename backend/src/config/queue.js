import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "./env.js";

export const redisConnection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null
});

export const submissionAnalysisQueue = new Queue("submission-analysis", {
  connection: redisConnection
});
