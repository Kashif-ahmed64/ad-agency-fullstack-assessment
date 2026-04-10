export default function Step3Creative({ data, onChange }) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Tone of Voice</span>
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
        <span className="mb-1 text-sm font-medium text-slate-300">Imagery Style</span>
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
        <span className="mb-1 text-sm font-medium text-slate-300">Color Direction</span>
        <input
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          value={data.colorDirection}
          onChange={(e) => onChange({ ...data, colorDirection: e.target.value })}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Dos</span>
        <textarea
          rows={3}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          value={data.dos}
          onChange={(e) => onChange({ ...data, dos: e.target.value })}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Donts</span>
        <textarea
          rows={3}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          value={data.donts}
          onChange={(e) => onChange({ ...data, donts: e.target.value })}
        />
      </label>
    </div>
  );
}

