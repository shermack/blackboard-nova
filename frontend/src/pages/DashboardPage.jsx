import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnalyticsCharts from "../components/charts/AnalyticsCharts";
import MetricCard from "../components/ui/MetricCard";
import GlassCard from "../components/ui/GlassCard";
import api from "../lib/api";

export default function DashboardPage({ user }) {
  const [analytics, setAnalytics] = useState({
    summary: {},
    gradeDistribution: [],
    submissionTrend: []
  });
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/analytics/dashboard"), api.get("/courses"), api.get("/assignments")]).then(
      ([analyticsResponse, coursesResponse, assignmentsResponse]) => {
        setAnalytics(analyticsResponse.data);
        setCourses(coursesResponse.data.courses || []);
        setAssignments(assignmentsResponse.data.assignments || []);
      }
    );
  }, []);

  const panels = [
    {
      label: user.role === "STUDENT" ? "Enrolled Courses" : "Courses",
      value: analytics.summary.courses ?? 0,
      hint: "Active academic spaces available to you"
    },
    {
      label: "Assignments",
      value: analytics.summary.assignments ?? 0,
      hint: "Published workstreams across your courses"
    },
    {
      label: "Submissions",
      value: analytics.summary.submissions ?? 0,
      hint: "All tracked submissions in your scope"
    },
    {
      label: "Average Grade",
      value: `${analytics.summary.averageGrade ?? 0}%`,
      hint: "Rolling class performance signal"
    }
  ];

  return (
    <div className="space-y-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[30px] p-6"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-mint">{user.role} Dashboard</p>
        <h1 className="mt-3 font-display text-4xl text-white">A polished overview of academic delivery.</h1>
        <p className="mt-3 max-w-3xl text-sky-100/72">
          Monitor submissions, deadlines, integrity risks, and performance trends from one animated control
          surface.
        </p>
      </motion.section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {panels.map((panel) => (
          <MetricCard key={panel.label} {...panel} />
        ))}
      </div>
      <AnalyticsCharts
        gradeDistribution={analytics.gradeDistribution}
        submissionTrend={analytics.submissionTrend}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="text-lg font-semibold text-white">Course Pulse</h3>
          <div className="mt-5 grid gap-3">
            {courses.slice(0, 5).map((entry) => {
              const course = entry.course || entry;
              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{course.name}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{course.code}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-lg font-semibold text-white">Deadline Radar</h3>
          <div className="mt-5 grid gap-3">
            {assignments.slice(0, 5).map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80"
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{assignment.title}</span>
                  <span className="text-xs text-mint">
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-sky-100/65">{assignment.course?.name}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
