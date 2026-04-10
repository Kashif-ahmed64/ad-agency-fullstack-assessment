export default function Step1Client({ data, onChange }) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Client Name *</span>
        <input
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          value={data.clientName}
          onChange={(e) => onChange({ ...data, clientName: e.target.value })}
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Industry *</span>
        <input
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          value={data.industry}
          onChange={(e) => onChange({ ...data, industry: e.target.value })}
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Website</span>
        <input
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          value={data.website}
          onChange={(e) => onChange({ ...data, website: e.target.value })}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="mb-1 text-sm font-medium text-slate-300">Key Competitors</span>
        <textarea
          rows={4}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          value={data.competitors}
          onChange={(e) => onChange({ ...data, competitors: e.target.value })}
        />
      </label>
    </div>
  );
}

