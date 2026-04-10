export default function Step4Review({ formData, onSubmit, loading }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/40">
        <p><strong>Client:</strong> {formData.clientName}</p>
        <p><strong>Industry:</strong> {formData.industry}</p>
        <p><strong>Website:</strong> {formData.website || "-"}</p>
        <p><strong>Competitors:</strong> {formData.competitors || "-"}</p>
        <p><strong>Objective:</strong> {formData.objective}</p>
        <p><strong>Target Audience:</strong> {formData.targetAudience}</p>
        <p><strong>Budget:</strong> ${formData.budget || 0}</p>
        <p><strong>Tone:</strong> {formData.tone}</p>
        <p><strong>Imagery:</strong> {formData.imagery}</p>
        <p><strong>Color Direction:</strong> {formData.colorDirection || "-"}</p>
        <p><strong>Dos:</strong> {formData.dos || "-"}</p>
        <p><strong>Donts:</strong> {formData.donts || "-"}</p>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Generating..." : "Submit"}
      </button>
    </div>
  );
}

