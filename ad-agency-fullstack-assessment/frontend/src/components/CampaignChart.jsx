import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function CampaignChart({ data }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-black/5 transition-all duration-200 dark:border-slate-700 dark:bg-[#1e293b] dark:shadow-black/20">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">30-Day Performance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Impressions and clicks over time</p>
        </div>
      </div>
      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
            />
            <YAxis axisLine={{ stroke: "#334155" }} tickLine={{ stroke: "#334155" }} tick={{ fill: "#94a3b8" }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend content={<ChartLegend />} />
            <Line type="monotone" dataKey="impressions" stroke="#6366f1" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="clicks" stroke="#22c55e" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-lg shadow-black/20">
      <p className="text-xs font-semibold text-slate-200">{label}</p>
      <div className="mt-1 space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4 text-xs text-slate-200">
            <span className="text-slate-300">{item.name}</span>
            <span className="font-mono font-bold">{Number(item.value || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartLegend({ payload }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
      {(payload || []).map((entry) => (
        <span key={entry.dataKey} className="inline-flex items-center gap-2">
          <span
            className={[
              "h-2 w-2 rounded-full",
              entry.dataKey === "impressions" ? "bg-indigo-500" : "",
              entry.dataKey === "clicks" ? "bg-emerald-500" : "",
              entry.dataKey !== "impressions" && entry.dataKey !== "clicks" ? "bg-slate-500" : ""
            ].join(" ")}
          />
          <span className="capitalize">{entry.value}</span>
        </span>
      ))}
    </div>
  );
}

