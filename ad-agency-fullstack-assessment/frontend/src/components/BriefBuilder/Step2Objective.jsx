export default function Step2Objective({ data, onChange }) {
  const objectives = ["Awareness", "Consideration", "Conversion"];
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 text-sm">
        <p className="text-sm font-medium text-slate-300">Campaign Objective</p>
        <div className="grid gap-3 md:grid-cols-3">
          {objectives.map((objective) => (
            <label
              key={objective}
              className={[
                "cursor-pointer rounded-xl border p-4 transition-all duration-200",
                data.objective === objective ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 bg-slate-900 hover:bg-slate-800"
              ].join(" ")}
            >
              <input
                type="radio"
                name="objective"
                value={objective}
                checked={data.objective === objective}
                onChange={(e) => onChange({ ...data, objective: e.target.value })}
                className="sr-only"
              />
              <p className="font-bold tracking-tight text-slate-100">{objective}</p>
              <p className="mt-1 text-xs text-slate-400">
                {objective === "Awareness"
                  ? "Maximize reach and top-of-funnel visibility."
                  : objective === "Consideration"
                    ? "Drive engagement and intent signals."
                    : "Optimize for leads, purchases, and ROI."}
              </p>
            </label>
          ))}
        </div>
      </div>
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Target Audience *</span>
        <textarea
          rows={4}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          value={data.targetAudience}
          onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Budget</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-9 pr-4 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={data.budget}
            onChange={(e) => onChange({ ...data, budget: e.target.value })}
          />
        </div>
      </label>
    </div>
  );
}

