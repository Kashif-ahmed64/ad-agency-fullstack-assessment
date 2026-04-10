export default function Step2Objective({ data, onChange }) {
  const objectives = ["Awareness", "Consideration", "Conversion"];
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 text-sm">
        <p>Campaign Objective</p>
        <div className="flex flex-wrap gap-3">
          {objectives.map((objective) => (
            <label key={objective} className="flex items-center gap-2">
              <input
                type="radio"
                name="objective"
                value={objective}
                checked={data.objective === objective}
                onChange={(e) => onChange({ ...data, objective: e.target.value })}
              />
              {objective}
            </label>
          ))}
        </div>
      </div>
      <label className="grid gap-1 text-sm">
        <span>Target Audience *</span>
        <textarea
          rows={4}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.targetAudience}
          onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Budget</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-2">$</span>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-8 pr-3 dark:border-slate-700 dark:bg-slate-950"
            value={data.budget}
            onChange={(e) => onChange({ ...data, budget: e.target.value })}
          />
        </div>
      </label>
    </div>
  );
}

