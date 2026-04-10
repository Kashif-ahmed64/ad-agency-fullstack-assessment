export default function Step3Creative({ data, onChange }) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-1 text-sm">
        <span>Tone of Voice</span>
        <select
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.tone}
          onChange={(e) => onChange({ ...data, tone: e.target.value })}
        >
          {["Professional", "Playful", "Luxury", "Bold", "Minimal"].map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span>Imagery Style</span>
        <select
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.imagery}
          onChange={(e) => onChange({ ...data, imagery: e.target.value })}
        >
          {["Photography", "Illustration", "Typography", "Mixed"].map((imagery) => (
            <option key={imagery} value={imagery}>
              {imagery}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span>Color Direction</span>
        <input
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.colorDirection}
          onChange={(e) => onChange({ ...data, colorDirection: e.target.value })}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Dos</span>
        <textarea
          rows={3}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.dos}
          onChange={(e) => onChange({ ...data, dos: e.target.value })}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Donts</span>
        <textarea
          rows={3}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.donts}
          onChange={(e) => onChange({ ...data, donts: e.target.value })}
        />
      </label>
    </div>
  );
}

