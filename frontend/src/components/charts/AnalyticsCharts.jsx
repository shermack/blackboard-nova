import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import GlassCard from "../ui/GlassCard";

const colors = ["#7dd3fc", "#5eead4", "#ff7a59", "#fbbf24"];

export default function AnalyticsCharts({ gradeDistribution = [], submissionTrend = [] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <GlassCard className="p-5">
        <h3 className="text-lg font-semibold text-white">Grade Distribution</h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeDistribution}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="range" stroke="#c7d2fe" />
              <YAxis stroke="#c7d2fe" />
              <Tooltip />
              <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                {gradeDistribution.map((entry, index) => (
                  <Cell key={entry.range} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
      <GlassCard className="p-5">
        <h3 className="text-lg font-semibold text-white">Submission Rates</h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={submissionTrend}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="assignment" stroke="#c7d2fe" />
              <YAxis stroke="#c7d2fe" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="submitted"
                stroke="#7dd3fc"
                strokeWidth={3}
                dot={{ fill: "#ff7a59", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
