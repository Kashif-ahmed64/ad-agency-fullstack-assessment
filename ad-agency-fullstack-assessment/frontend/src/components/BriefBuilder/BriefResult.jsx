import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

export default function BriefResult({ result }) {
  async function exportPdf() {
    const node = document.getElementById("brief-result");
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2 });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(image, "PNG", 10, 10, width, height);
    pdf.save("campaign-brief.pdf");
  }

  return (
    <div
      id="brief-result"
      className="relative rounded-xl border border-slate-700 bg-[#1e293b] p-8 shadow-lg shadow-black/20 transition-all duration-200"
    >
      <div className="mb-6">
        <h2 className="text-4xl font-bold tracking-tight text-slate-100">
          <span className="inline-block border-b-4 border-indigo-500 pb-2">{result.campaign_title}</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">AI-generated creative brief output</p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {(result.headlines || []).map((headline, index) => (
          <div key={`${headline}-${index}`} className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg shadow-black/20">
            <p className="text-3xl font-bold tracking-tight text-indigo-400">{String(index + 1).padStart(2, "0")}</p>
            <p className="mt-2 font-medium text-slate-100">{headline}</p>
          </div>
        ))}
      </div>

      <blockquote className="mb-6 border-l-4 border-indigo-500 pl-6 italic text-slate-200">
        {result.tone_guide}
      </blockquote>

      <div className="mb-6">
        <p className="mb-3 text-sm font-bold tracking-tight text-slate-100">Channel mix</p>
        <div className="grid gap-3">
          {(result.channels || []).map((channel) => (
            <div key={channel.name} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-200">{channel.name}</p>
                <p className="text-sm font-mono font-bold text-slate-100">{channel.budget_percentage}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className={`h-2 rounded-full bg-indigo-500 ${barWidthClass(channel.budget_percentage)}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-bold tracking-tight text-slate-100">Visual direction</p>
        <p className="rounded-xl border-l-4 border-indigo-500 bg-slate-900 p-6 italic text-slate-200">{result.visual_direction}</p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={exportPdf}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </button>
      </div>
    </div>
  );
}

function barWidthClass(pct) {
  const p = Number(pct || 0);
  if (p >= 85) return "w-full";
  if (p >= 70) return "w-5/6";
  if (p >= 55) return "w-2/3";
  if (p >= 40) return "w-1/2";
  if (p >= 25) return "w-1/3";
  if (p >= 10) return "w-1/4";
  return "w-1/6";
}

