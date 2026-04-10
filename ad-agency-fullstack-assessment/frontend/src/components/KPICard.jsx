import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function KPICard({ icon, label, value, change, positive = true }) {
  const iconShell = iconShellClass(label);
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-black/5 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-[#1e293b] dark:shadow-black/20 dark:hover:border-slate-600">
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconShell}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-xs text-slate-400">vs last period</div>
          <div
            className={[
              "mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums",
              positive
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                : "border-rose-500/30 bg-rose-500/15 text-rose-400"
            ].join(" ")}
          >
            {positive ? <ArrowUpRight size={20} strokeWidth={1.5} /> : <ArrowDownRight size={20} strokeWidth={1.5} />}
            {positive ? "+" : ""}
            {change}%
          </div>
        </div>
      </div>

      <div>
        <p className="text-3xl font-mono font-bold leading-none text-slate-900 dark:text-slate-100">{value}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
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

