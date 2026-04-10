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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">30-Day Performance Trend</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Impressions and clicks over time</p>
      </div>
      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="impressions" stroke="#6366f1" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="clicks" stroke="#22c55e" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

