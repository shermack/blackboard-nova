import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import api from "../lib/api";
import { authStorage } from "../lib/auth-store";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "STUDENT"
  });

  const submit = async (event) => {
    event.preventDefault();

    if (mode === "register") {
      await api.post("/auth/register", form);
    }

    const { data } = await api.post("/auth/login", {
      email: form.email,
      password: form.password
    });

    authStorage.setSession(data);
    onLogin(data.user);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <GlassCard className="w-full max-w-xl p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-mint">Secure Access</p>
        <h1 className="mt-4 font-display text-4xl text-white">
          {mode === "login" ? "Welcome back" : "Create your academic profile"}
        </h1>
        <form className="mt-8 grid gap-4" onSubmit={submit}>
          {mode === "register" && (
            <input
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              placeholder="Full name"
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            />
          )}
          <input
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
            placeholder="University email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          {mode === "register" && (
            <select
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            >
              <option value="STUDENT">Student</option>
              <option value="LECTURER">Lecturer</option>
              <option value="ADMIN">Admin</option>
            </select>
          )}
          <Button type="submit">{mode === "login" ? "Sign In" : "Register & Continue"}</Button>
        </form>
        <button
          onClick={() => setMode((current) => (current === "login" ? "register" : "login"))}
          className="mt-4 text-sm text-sky-100/75"
        >
          {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
        </button>
      </GlassCard>
    </div>
  );
}
