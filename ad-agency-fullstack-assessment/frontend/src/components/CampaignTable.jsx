const statusStyles = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  draft: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Campaign Performance</h2>
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by campaign or client"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500 focus:ring-2 md:w-80 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              {columns.map((column) => (
                <th key={column.key} className="px-2 py-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300"
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                    {sortBy === column.key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
              ))}
              <th className="px-2 py-3 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((campaign) => (
              <tr key={campaign.id} className="border-b border-slate-100 dark:border-slate-800/80">
                <td className="px-2 py-3 font-medium text-slate-900 dark:text-slate-100">{campaign.name}</td>
                <td className="px-2 py-3 text-slate-700 dark:text-slate-300">{campaign.client}</td>
                <td className="px-2 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-2 py-3">${campaign.budget.toLocaleString()}</td>
                <td className="px-2 py-3">${campaign.spend.toLocaleString()}</td>
                <td className="px-2 py-3">{campaign.impressions.toLocaleString()}</td>
                <td className="px-2 py-3">{campaign.clicks.toLocaleString()}</td>
                <td className="px-2 py-3">{campaign.ctr.toFixed(2)}%</td>
                <td className="px-2 py-3">{campaign.conversions.toLocaleString()}</td>
                <td className="px-2 py-3">{campaign.roas.toFixed(2)}</td>
                <td className="px-2 py-3">
                  <div className="flex gap-2">
                    <button type="button" className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
                      Edit
                    </button>
                    <button type="button" className="rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white">
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

