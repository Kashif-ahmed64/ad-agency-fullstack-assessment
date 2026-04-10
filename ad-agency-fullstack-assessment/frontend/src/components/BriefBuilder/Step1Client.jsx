export default function Step1Client({ data, onChange }) {
  return (
    <div className="space-y-6">
      <label className="mb-6 flex flex-col gap-1">
        <span className="mb-2 block text-sm font-medium text-slate-300">Client Name *</span>
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={data.clientName}
          onChange={(e) => onChange({ ...data, clientName: e.target.value })}
          required
        />
      </label>
      <label className="mb-6 flex flex-col gap-1">
        <span className="mb-2 block text-sm font-medium text-slate-300">Industry *</span>
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={data.industry}
          onChange={(e) => onChange({ ...data, industry: e.target.value })}
          required
        />
      </label>
      <label className="mb-6 flex flex-col gap-1">
        <span className="mb-2 block text-sm font-medium text-slate-300">Website</span>
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={data.website}
          onChange={(e) => onChange({ ...data, website: e.target.value })}
        />
      </label>
      <label className="mb-6 flex flex-col gap-1">
        <span className="mb-2 block text-sm font-medium text-slate-300">Key Competitors</span>
        <textarea
          rows={4}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={data.competitors}
          onChange={(e) => onChange({ ...data, competitors: e.target.value })}
        />
      </label>
    </div>
  );
}

