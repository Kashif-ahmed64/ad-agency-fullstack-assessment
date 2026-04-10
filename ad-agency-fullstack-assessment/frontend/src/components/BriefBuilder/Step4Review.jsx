import { Loader2, Send } from "lucide-react";

export default function Step4Review({ formData, onSubmit, loading }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-sm shadow-lg shadow-black/20">
        <p className="mb-4 text-base font-bold tracking-tight text-slate-100">Review</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Client" value={formData.clientName} />
          <Field label="Industry" value={formData.industry} />
          <Field label="Website" value={formData.website || "-"} />
          <Field label="Competitors" value={formData.competitors || "-"} />
          <Field label="Objective" value={formData.objective} />
          <Field label="Budget" value={`$${formData.budget || 0}`} />
          <div className="md:col-span-2">
            <Field label="Target Audience" value={formData.targetAudience} />
          </div>
          <Field label="Tone" value={formData.tone} />
          <Field label="Imagery" value={formData.imagery} />
          <Field label="Color Direction" value={formData.colorDirection || "-"} />
          <div className="md:col-span-2">
            <Field label="Dos" value={formData.dos || "-"} />
          </div>
          <div className="md:col-span-2">
            <Field label="Donts" value={formData.donts || "-"} />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:opacity-60"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={20} strokeWidth={1.5} className="animate-spin" />
            Generating...
          </span>
        ) : (
          <>
            <Send size={20} strokeWidth={1.5} />
            Submit
          </>
        )}
      </button>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  );
}

