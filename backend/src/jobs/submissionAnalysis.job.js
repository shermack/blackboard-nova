import { Worker } from "bullmq";
import { prisma } from "../config/prisma.js";
import { redisConnection } from "../config/queue.js";
import { estimateAiScore, extractTextFromBuffer } from "../services/aiDetection.service.js";
import { cosineSimilarity } from "../services/similarity.service.js";

export const startSubmissionAnalysisWorker = () => {
  const worker = new Worker(
    "submission-analysis",
    async (job) => {
      const submission = await prisma.submission.findUnique({
        where: { id: job.data.submissionId },
        include: {
          assignment: {
            include: {
              submissions: true
            }
          }
        }
      });

      if (!submission) {
        return;
      }

      const extractedText = submission.mimeType.includes("zip")
        ? ""
        : await extractTextFromBuffer({
            mimetype: submission.mimeType,
            buffer: Buffer.from(job.data.fileBufferBase64, "base64")
          }).catch(() => "");

      const aiScore = estimateAiScore(extractedText);
      const peers = submission.assignment.submissions.filter((item) => item.id !== submission.id);
      const highestSimilarity = peers.reduce((highest, peer) => {
        const score = cosineSimilarity(extractedText, peer.extractedText || "");
        return Math.max(highest, score);
      }, 0);

      const suspicious = aiScore >= 65 || highestSimilarity >= 0.78;
      let suspicionGroupId = null;

      if (suspicious) {
        const group = await prisma.suspicionGroup.create({
          data: {
            courseId: submission.assignment.courseId,
            reason:
              aiScore >= 65 && highestSimilarity >= 0.78
                ? "High AI probability and similarity"
                : aiScore >= 65
                  ? "High AI probability"
                  : "High submission similarity"
          }
        });
        suspicionGroupId = group.id;
      }

      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          extractedText,
          aiScore,
          similarityScore: Number((highestSimilarity * 100).toFixed(2)),
          suspicious,
          status: suspicious ? "FLAGGED" : "SUBMITTED",
          suspicionGroupId
        }
      });
    },
    { connection: redisConnection }
  );

  return worker;
};
