import { useMemo, useState } from "react";
import Step1Client from "./Step1Client";
import Step2Objective from "./Step2Objective";
import Step3Creative from "./Step3Creative";
import Step4Review from "./Step4Review";
import BriefResult from "./BriefResult";

const labels = ["Client Details", "Objectives", "Creative Preferences", "Review & Submit"];

export default function BriefBuilder() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [formData, setFormData] = useState({
    clientName: "",
    industry: "",
    website: "",
    competitors: "",
    objective: "Awareness",
    targetAudience: "",
    budget: "",
    tone: "Professional",
    imagery: "Photography",
    colorDirection: "",
    dos: "",
    donts: ""
  });

  const progress = useMemo(() => (step / 4) * 100, [step]);

  async function submitBrief() {
    setLoading(true);
    try {
      const briefString = `
Client: ${formData.clientName}
Industry: ${formData.industry}
Website: ${formData.website}
Competitors: ${formData.competitors}
Objective: ${formData.objective}
Target Audience: ${formData.targetAudience}
Budget: ${formData.budget}
Tone: ${formData.tone}
Imagery: ${formData.imagery}
Color Direction: ${formData.colorDirection}
Dos: ${formData.dos}
Donts: ${formData.donts}
      `.trim();

      const response = await fetch("http://localhost:3002/generate/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: briefString,
          tone: formData.tone,
          platform: formData.objective,
          word_limit: 500
        })
      });
      const data = await response.json();
      setAiResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-500">
          {labels.map((label, i) => (
            <span key={label} className={step === i + 1 ? "font-semibold text-indigo-600" : ""}>
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="h-2 w-full rounded bg-slate-200 dark:bg-slate-800">
          <div className="h-2 rounded bg-indigo-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!aiResult && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          {step === 1 && <Step1Client data={formData} onChange={setFormData} />}
          {step === 2 && <Step2Objective data={formData} onChange={setFormData} />}
          {step === 3 && <Step3Creative data={formData} onChange={setFormData} />}
          {step === 4 && <Step4Review formData={formData} onSubmit={submitBrief} loading={loading} />}

          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="rounded-md bg-slate-200 px-4 py-2 text-slate-800 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100"
            >
              Back
            </button>
            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className="rounded-md bg-indigo-600 px-4 py-2 text-white"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {aiResult && <BriefResult result={aiResult} />}
    </section>
  );
}

