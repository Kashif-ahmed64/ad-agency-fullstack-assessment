export default function Step1Client({ data, onChange }) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-1 text-sm">
        <span>Client Name *</span>
        <input
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.clientName}
          onChange={(e) => onChange({ ...data, clientName: e.target.value })}
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Industry *</span>
        <input
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.industry}
          onChange={(e) => onChange({ ...data, industry: e.target.value })}
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Website</span>
        <input
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.website}
          onChange={(e) => onChange({ ...data, website: e.target.value })}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Key Competitors</span>
        <textarea
          rows={4}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          value={data.competitors}
          onChange={(e) => onChange({ ...data, competitors: e.target.value })}
        />
      </label>
    </div>
  );
}

