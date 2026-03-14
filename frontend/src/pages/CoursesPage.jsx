import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import api from "../lib/api";

const initialCourseForm = { name: "", description: "" };

export default function CoursesPage({ user }) {
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [joinCode, setJoinCode] = useState("");

  const loadCourses = () => api.get("/courses").then((response) => setCourses(response.data.courses || []));

  useEffect(() => {
    loadCourses();
  }, []);

  const createCourse = async (event) => {
    event.preventDefault();
    await api.post("/courses", courseForm);
    setCourseForm(initialCourseForm);
    loadCourses();
  };

  const joinCourse = async (event) => {
    event.preventDefault();
    await api.post("/courses/join", { courseCode: joinCode });
    setJoinCode("");
    loadCourses();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <GlassCard className="p-5">
        <h2 className="text-2xl font-semibold text-white">Course management</h2>
        <p className="mt-2 text-sm text-sky-100/72">
          Lecturers create course spaces and students join with generated codes.
        </p>
        {user.role === "LECTURER" && (
          <form className="mt-6 grid gap-3" onSubmit={createCourse}>
            <input
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              placeholder="Course title"
              value={courseForm.name}
              onChange={(event) => setCourseForm((current) => ({ ...current, name: event.target.value }))}
            />
            <textarea
              className="min-h-32 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              placeholder="Course description"
              value={courseForm.description}
              onChange={(event) =>
                setCourseForm((current) => ({ ...current, description: event.target.value }))
              }
            />
            <Button type="submit">Create Course</Button>
          </form>
        )}
        {user.role === "STUDENT" && (
          <form className="mt-6 grid gap-3" onSubmit={joinCourse}>
            <input
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              placeholder="Enter course code"
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value)}
            />
            <Button type="submit">Join Course</Button>
          </form>
        )}
      </GlassCard>
      <GlassCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Active courses</h3>
        <div className="mt-5 grid gap-3">
          {courses.map((entry) => {
            const course = entry.course || entry;
            const counts = course._count || {};
            return (
              <div
                key={course.id}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white/85"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg">{course.name}</h4>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{course.code}</span>
                </div>
                <p className="mt-2 text-sm text-sky-100/65">{course.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/45">
                  {counts.enrollments || 0} students • {counts.assignments || 0} assignments
                </p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
