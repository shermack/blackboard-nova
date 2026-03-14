import { app } from "./app.js";
import { env } from "./config/env.js";
import { startSubmissionAnalysisWorker } from "./jobs/submissionAnalysis.job.js";

app.listen(env.port, () => {
  startSubmissionAnalysisWorker();
  console.log(`Backend running on port ${env.port}`);
});
