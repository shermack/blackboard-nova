import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
  { to: "/assignments", label: "Assignments" },
  { to: "/grading", label: "Grading" },
  { to: "/analytics", label: "Analytics" }
];

export default function AppShell({ user, onLogout, children }) {
  return (
    <div className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <motion.aside
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass grid-lines rounded-[30px] p-5"
        >
          <Link to="/" className="font-display text-3xl text-white">
            Blackboard Nova
          </Link>
          <p className="mt-2 text-sm text-white/65">
            Elegant academic workflows for students, lecturers, and administrators.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Signed in as</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{user?.fullName || "Guest"}</h2>
            <p className="text-sm text-sky-100/70">{user?.role || "Public"}</p>
          </div>
          <nav className="mt-8 space-y-2">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive ? "bg-white text-slate-950" : "bg-white/5 text-white/75 hover:bg-white/10"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={onLogout}
            className="mt-auto rounded-2xl border border-white/10 px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/10"
          >
            Sign out
          </button>
        </motion.aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
