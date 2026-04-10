import { ChevronDown, ChevronUp, Search } from "lucide-react";

const statusStyles = {
  active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  paused: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  completed: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  draft: "bg-slate-500/20 text-slate-400 border border-slate-500/30"
};

export default function CampaignTable({ rows, sortBy, sortOrder, onSort, search, onSearch }) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "client", label: "Client" },
    { key: "status", label: "Status" },
    { key: "budget", label: "Budget" },
    { key: "spend", label: "Spend" },
    { key: "impressions", label: "Impressions" },
    { key: "clicks", label: "Clicks" },
    { key: "ctr", label: "CTR" },
    { key: "conversions", label: "Conversions" },
    { key: "roas", label: "ROAS" }
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-black/5 transition-all duration-200 dark:border-slate-700 dark:bg-[#1e293b] dark:shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/40 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Campaign Performance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sort and filter across all live campaigns</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by campaign or client"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-slate-300 transition-all duration-200 hover:text-white"
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                    {sortBy === column.key ? (
                      sortOrder === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : null}
                  </button>
                </th>
              ))}
              <th className="px-3 py-3 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-slate-200 transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/40"
              >
                <td className="px-3 py-4 font-medium text-slate-900 dark:text-slate-100">{campaign.name}</td>
                <td className="px-3 py-4 text-slate-600 dark:text-slate-300">{campaign.client}</td>
                <td className="px-3 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-3 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">${campaign.budget.toLocaleString()}</td>
                <td className="px-3 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">${campaign.spend.toLocaleString()}</td>
                <td className="px-3 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">{campaign.impressions.toLocaleString()}</td>
                <td className="px-3 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">{campaign.clicks.toLocaleString()}</td>
                <td className="px-3 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">{campaign.ctr.toFixed(2)}%</td>
                <td className="px-3 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">{campaign.conversions.toLocaleString()}</td>
                <td className="px-3 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">{campaign.roas.toFixed(2)}</td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 text-xs font-medium text-rose-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

