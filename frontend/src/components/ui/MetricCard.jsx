import GlassCard from "./GlassCard";

export default function MetricCard({ label, value, hint }) {
  return (
    <GlassCard className="p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-white/55">{label}</p>
      <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
      <p className="mt-2 text-sm text-sky-100/70">{hint}</p>
    </GlassCard>
  );
}
