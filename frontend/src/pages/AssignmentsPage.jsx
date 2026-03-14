import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import api from "../lib/api";

const initialAssignmentForm = {
  title: "",
  description: "",
  deadline: "",
  maxMarks: 100,
  courseId: ""
};

export default function AssignmentsPage({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState(initialAssignmentForm);

  const load = () =>
    Promise.all([api.get("/assignments"), api.get("/courses")]).then(([assignmentResponse, courseResponse]) => {
      setAssignments(assignmentResponse.data.assignments || []);
      setCourses((courseResponse.data.courses || []).map((entry) => entry.course || entry));
    });

  useEffect(() => {
    load();
  }, []);

  const createAssignment = async (event) => {
    event.preventDefault();
    await api.post("/assignments", assignmentForm);
    setAssignmentForm(initialAssignmentForm);
    load();
  };

  const submitAssignment = async (assignmentId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    await api.post(`/assignments/${assignmentId}/submissions`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    load();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
      {user.role === "LECTURER" && (
        <GlassCard className="p-5">
          <h2 className="text-2xl font-semibold text-white">Create assignment</h2>
          <form className="mt-5 grid gap-3" onSubmit={createAssignment}>
            <input
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              placeholder="Assignment title"
              value={assignmentForm.title}
              onChange={(event) => setAssignmentForm((current) => ({ ...current, title: event.target.value }))}
            />
            <textarea
              className="min-h-28 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              placeholder="Assignment description"
              value={assignmentForm.description}
              onChange={(event) =>
                setAssignmentForm((current) => ({ ...current, description: event.target.value }))
              }
            />
            <select
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              value={assignmentForm.courseId}
              onChange={(event) => setAssignmentForm((current) => ({ ...current, courseId: event.target.value }))}
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
                type="datetime-local"
                value={assignmentForm.deadline}
                onChange={(event) =>
                  setAssignmentForm((current) => ({ ...current, deadline: event.target.value }))
                }
              />
              <input
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
                type="number"
                value={assignmentForm.maxMarks}
                onChange={(event) =>
                  setAssignmentForm((current) => ({ ...current, maxMarks: event.target.value }))
                }
              />
            </div>
            <Button type="submit">Publish Assignment</Button>
          </form>
        </GlassCard>
      )}
      <GlassCard className="p-5">
        <h2 className="text-2xl font-semibold text-white">Assignment board</h2>
        <div className="mt-5 grid gap-3">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white/85"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg">{assignment.title}</h3>
                  <p className="mt-1 text-sm text-sky-100/65">{assignment.course?.name}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                  Due {new Date(assignment.deadline).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-3 text-sm text-sky-100/72">{assignment.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/45">
                <span>Max marks {assignment.maxMarks}</span>
                <span>Files PDF DOCX ZIP</span>
              </div>
              {user.role === "STUDENT" && (
                <label className="mt-4 block cursor-pointer rounded-2xl border border-dashed border-white/20 px-4 py-4 text-sm text-white/70 hover:bg-white/5">
                  Upload submission
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        submitAssignment(assignment.id, file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
