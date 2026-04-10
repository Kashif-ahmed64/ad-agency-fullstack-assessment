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

  const progress = useMemo(() => step, [step]);

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
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-700 bg-[#1e293b] p-6 shadow-lg shadow-black/20 transition-all duration-200">
        <div className="flex flex-wrap items-center gap-4">
          {labels.map((label, i) => {
            const index = i + 1;
            const completed = index < progress;
            const current = index === progress;
            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full border text-sm font-bold tracking-tight transition-all duration-200",
                    completed ? "border-indigo-500 bg-indigo-600 text-white" : "",
                    current ? "border-slate-200 text-slate-100" : "",
                    !completed && !current ? "border-slate-700 bg-slate-900 text-slate-400" : ""
                  ].join(" ")}
                >
                  {String(index).padStart(2, "0")}
                </div>
                <div className="min-w-[10rem]">
                  <p className={["text-sm font-bold tracking-tight", current ? "text-slate-100" : "text-slate-300"].join(" ")}>
                    {label}
                  </p>
                  <p className="text-xs text-slate-400">{completed ? "Completed" : current ? "In progress" : "Upcoming"}</p>
                </div>
                {i < labels.length - 1 && <div className="hidden h-px w-10 bg-slate-700 sm:block" />}
              </div>
            );
          })}
        </div>
      </div>

      {!aiResult && (
        <div className="rounded-xl border border-slate-700 bg-[#1e293b] p-8 shadow-lg shadow-black/20 transition-all duration-200">
          {step === 1 && <Step1Client data={formData} onChange={setFormData} />}
          {step === 2 && <Step2Objective data={formData} onChange={setFormData} />}
          {step === 3 && <Step3Creative data={formData} onChange={setFormData} />}
          {step === 4 && <Step4Review formData={formData} onSubmit={submitBrief} loading={loading} />}

          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-slate-800 disabled:opacity-50"
            >
              Back
            </button>
            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-indigo-700"
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

