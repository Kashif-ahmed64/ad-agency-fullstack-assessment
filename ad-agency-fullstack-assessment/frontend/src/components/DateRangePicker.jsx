const presets = [
  { id: "7d", label: "Last 7d" },
  { id: "30d", label: "Last 30d" },
  { id: "90d", label: "Last 90d" },
  { id: "custom", label: "Custom" }
];

export default function DateRangePicker({ selected, onChange, customRange, onCustomRangeChange }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-black/5 transition-all duration-200 dark:border-slate-700 dark:bg-[#1e293b] dark:shadow-black/20">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={[
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
              selected === preset.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            ].join(" ")}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {selected === "custom" && (
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <input
            type="date"
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={customRange.from}
            onChange={(event) => onCustomRangeChange({ ...customRange, from: event.target.value })}
          />
          <input
            type="date"
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={customRange.to}
            onChange={(event) => onCustomRangeChange({ ...customRange, to: event.target.value })}
          />
        </div>
      )}
    </div>
  );
}

