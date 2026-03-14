import { useEffect, useState } from "react";
import AnalyticsCharts from "../components/charts/AnalyticsCharts";
import MetricCard from "../components/ui/MetricCard";
import api from "../lib/api";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    summary: {},
    gradeDistribution: [],
    submissionTrend: []
  });

  useEffect(() => {
    api.get("/analytics/dashboard").then((response) => {
      setAnalytics(response.data);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Class Average"
          value={`${analytics.summary.averageGrade ?? 0}%`}
          hint="Average score across visible submissions"
        />
        <MetricCard
          label="Submission Rate"
          value={`${analytics.summary.submissionRate ?? 0}%`}
          hint="Percentage of assignments with tracked submissions"
        />
        <MetricCard
          label="Tracked Submissions"
          value={analytics.summary.submissions ?? 0}
          hint="Used for performance and integrity insights"
        />
      </div>
      <AnalyticsCharts
        gradeDistribution={analytics.gradeDistribution}
        submissionTrend={analytics.submissionTrend}
      />
    </div>
  );
}
