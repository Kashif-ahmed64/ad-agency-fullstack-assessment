import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function KPICard({ icon, label, value, change, positive = true }) {
  const iconShell = iconShellClass(label);
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-black/5 transition-all duration-200 hover:border-indigo-500 dark:border-slate-700 dark:bg-[#1e293b] dark:shadow-black/20">
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-lg p-2 transition-all duration-200 ${iconShell}`}>
          <span className="text-lg">{icon}</span>
        </div>
        <span
          className={[
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums",
            positive
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
              : "border-rose-500/30 bg-rose-500/15 text-rose-400"
          ].join(" ")}
        >
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {positive ? "+" : ""}
          {change}%
        </span>
      </div>

      <div className="mt-5 text-center">
        <p className="text-3xl font-bold text-slate-900 transition-all duration-200 dark:font-mono dark:text-slate-100">
          {value}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xs text-slate-400">vs last period</p>
      </div>
    </div>
  );
}

function iconShellClass(label) {
  if (label.toLowerCase().includes("impression")) return "bg-blue-500/15 text-blue-300";
  if (label.toLowerCase().includes("click")) return "bg-indigo-500/15 text-indigo-300";
  if (label.toLowerCase().includes("ctr")) return "bg-emerald-500/15 text-emerald-300";
  if (label.toLowerCase().includes("conversion")) return "bg-emerald-500/15 text-emerald-300";
  if (label.toLowerCase().includes("spend")) return "bg-amber-500/15 text-amber-300";
  if (label.toLowerCase().includes("roas")) return "bg-purple-500/15 text-purple-300";
  return "bg-slate-900 text-slate-200";
}

