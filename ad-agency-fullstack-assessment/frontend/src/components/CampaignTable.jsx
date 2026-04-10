import { ChevronDown, ChevronUp, Pencil, Search, Trash2 } from "lucide-react";

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
  const iconProps = { size: 20, strokeWidth: 1.5 };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-black/5 transition-all duration-200 dark:border-slate-700 dark:bg-[#1e293b] dark:shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/40 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Campaign Performance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sort and filter across all live campaigns</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search
            {...iconProps}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
          />
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
                <th key={column.key} className="px-4 py-3 align-middle">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1 font-semibold text-slate-300 transition-all duration-200 hover:text-white active:scale-95"
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                    {sortBy === column.key ? (
                      sortOrder === "asc" ? (
                        <ChevronUp {...iconProps} />
                      ) : (
                        <ChevronDown {...iconProps} />
                      )
                    ) : null}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 align-middle font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-slate-200 transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/40"
              >
                <td className="px-4 py-3 align-middle font-medium text-slate-900 dark:text-slate-100">
                  <span className="whitespace-nowrap">{campaign.name}</span>
                </td>
                <td className="px-4 py-3 align-middle text-slate-600 dark:text-slate-300">
                  <span className="whitespace-nowrap">{campaign.client}</span>
                </td>
                <td className="px-4 py-3 align-middle">
                  <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-middle text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                  <span className="whitespace-nowrap">${campaign.budget.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 align-middle text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                  <span className="whitespace-nowrap">${campaign.spend.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 align-middle font-mono font-bold text-slate-900 dark:text-slate-100">
                  <span className="whitespace-nowrap">{campaign.impressions.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 align-middle font-mono font-bold text-slate-900 dark:text-slate-100">
                  <span className="whitespace-nowrap">{campaign.clicks.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 align-middle font-mono font-bold text-slate-900 dark:text-slate-100">
                  <span className="whitespace-nowrap">{campaign.ctr.toFixed(2)}%</span>
                </td>
                <td className="px-4 py-3 align-middle font-mono font-bold text-slate-900 dark:text-slate-100">
                  <span className="whitespace-nowrap">{campaign.conversions.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 align-middle font-mono font-bold text-slate-900 dark:text-slate-100">
                  <span className="whitespace-nowrap">{campaign.roas.toFixed(2)}</span>
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-300 active:scale-95"
                    >
                      <Pencil {...iconProps} />
                      <span className="hidden lg:inline">Edit</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-rose-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300 active:scale-95"
                    >
                      <Trash2 {...iconProps} />
                      <span className="hidden lg:inline">Delete</span>
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

