const presets = [
  { id: "7d", label: "Last 7d" },
  { id: "30d", label: "Last 30d" },
  { id: "90d", label: "Last 90d" },
  { id: "custom", label: "Custom" }
];

export default function DateRangePicker({ selected, onChange, customRange, onCustomRangeChange }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              selected === preset.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {selected === "custom" && (
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <input
            type="date"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            value={customRange.from}
            onChange={(event) => onCustomRangeChange({ ...customRange, from: event.target.value })}
          />
          <input
            type="date"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            value={customRange.to}
            onChange={(event) => onCustomRangeChange({ ...customRange, to: event.target.value })}
          />
        </div>
      )}
    </div>
  );
}

