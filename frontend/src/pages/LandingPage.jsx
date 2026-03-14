import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";

export default function LandingPage() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass grid-lines overflow-hidden rounded-[36px] px-6 py-8 md:px-10 md:py-12"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-mint">University Assignment OS</p>
              <h1 className="mt-5 max-w-3xl font-display text-5xl leading-tight text-white md:text-7xl">
                Manage submissions, detect risk, and publish grades with polish.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-sky-100/78">
                A modern full stack platform for secure assignment workflows, smart integrity screening,
                analytics, grading exports, and role-based university operations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login">
                  <Button>Enter Platform</Button>
                </Link>
                <a href="#capabilities">
                  <Button variant="secondary">Explore Features</Button>
                </a>
              </div>
            </div>
            <GlassCard className="p-6">
              <div className="grid gap-4">
                {[
                  "JWT authentication with RBAC",
                  "Assignments, deadlines, uploads, grading",
                  "AI detection and submission similarity grouping",
                  "Bulk academic email campaigns",
                  "Animated dashboards and analytics"
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white/85"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
