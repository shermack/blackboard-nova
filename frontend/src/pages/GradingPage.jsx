import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import api from "../lib/api";

export default function GradingPage({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [rows, setRows] = useState([]);
  const [emailForm, setEmailForm] = useState({
    subject: "",
    body: ""
  });

  useEffect(() => {
    api.get("/assignments").then((response) => {
      const list = response.data.assignments || [];
      setAssignments(list);
      if (list[0]?.id) {
        setSelectedAssignmentId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedAssignmentId || user.role === "STUDENT") {
      return;
    }

    api.get(`/assignments/${selectedAssignmentId}/grading-table`).then((response) => {
      setRows(response.data.rows || []);
    });
  }, [selectedAssignmentId, user.role]);

  if (user.role === "STUDENT") {
    return (
      <GlassCard className="p-5">
        <h2 className="text-2xl font-semibold text-white">Grading access</h2>
        <p className="mt-3 text-sky-100/72">Lecturers and admins manage grading and grade publication here.</p>
      </GlassCard>
    );
  }

  const groupedRows = [
    {
      title: "High AI Probability",
      items: rows.filter((row) => row.aiScore >= 65)
    },
    {
      title: "High Similarity",
      items: rows.filter((row) => row.similarityScore >= 78)
    },
    {
      title: "Dual Risk",
      items: rows.filter((row) => row.aiScore >= 65 && row.similarityScore >= 78)
    }
  ].filter((group) => group.items.length);

  const updateGrade = async (submissionId, payload) => {
    await api.patch(`/grading/submissions/${submissionId}`, payload);
    const response = await api.get(`/assignments/${selectedAssignmentId}/grading-table`);
    setRows(response.data.rows || []);
  };

  const publishGrades = async () => {
    await api.post(`/grading/assignments/${selectedAssignmentId}/publish`);
  };

  const sendSuspiciousEmails = async (event) => {
    event.preventDefault();
    const recipients = rows.filter((row) => row.suspicious).map((row) => row.student.email);
    await api.post("/emails/bulk", {
      recipients,
      subject: emailForm.subject,
      body: emailForm.body
    });
    setEmailForm({ subject: "", body: "" });
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Grading studio</h2>
            <p className="mt-2 text-sm text-sky-100/72">
              Review flagged work, assign grades, publish results, and reach suspicious clusters quickly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              value={selectedAssignmentId}
              onChange={(event) => setSelectedAssignmentId(event.target.value)}
            >
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title}
                </option>
              ))}
            </select>
            <Button onClick={publishGrades}>Publish Grades</Button>
          </div>
        </div>
      </GlassCard>
      {!!groupedRows.length && (
        <div className="grid gap-4 xl:grid-cols-3">
          {groupedRows.map((group) => (
            <GlassCard key={group.title} className="p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-coral">{group.title}</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">{group.items.length}</h3>
              <div className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <div
                    key={`${group.title}-${item.id}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    {item.student.fullName}
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-white/85">
            <thead className="bg-white/10 text-xs uppercase tracking-[0.25em] text-white/55">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">AI Score</th>
                <th className="px-5 py-4">Similarity</th>
                <th className="px-5 py-4">File</th>
                <th className="px-5 py-4">Grade</th>
                <th className="px-5 py-4">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-5 py-4">
                    <p>{row.student.fullName}</p>
                    {row.suspicious && (
                      <span className="mt-2 inline-flex rounded-full bg-coral/20 px-2 py-1 text-xs text-coral">
                        Flagged
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">{row.aiScore}%</td>
                  <td className="px-5 py-4">{row.similarityScore}%</td>
                  <td className="px-5 py-4">{row.originalFileName}</td>
                  <td className="px-5 py-4">
                    <input
                      defaultValue={row.grade ?? ""}
                      className="w-24 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
                      onBlur={(event) => updateGrade(row.id, { grade: event.target.value, feedback: row.feedback })}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <textarea
                      defaultValue={row.feedback ?? ""}
                      className="min-h-24 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
                      onBlur={(event) => updateGrade(row.id, { grade: row.grade ?? 0, feedback: event.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <GlassCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Bulk email suspicious submissions</h3>
        <form className="mt-5 grid gap-3" onSubmit={sendSuspiciousEmails}>
          <input
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
            placeholder="Subject"
            value={emailForm.subject}
            onChange={(event) => setEmailForm((current) => ({ ...current, subject: event.target.value }))}
          />
          <textarea
            className="min-h-28 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
            placeholder="Message body"
            value={emailForm.body}
            onChange={(event) => setEmailForm((current) => ({ ...current, body: event.target.value }))}
          />
          <Button type="submit" variant="coral">
            Email Flagged Students
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
