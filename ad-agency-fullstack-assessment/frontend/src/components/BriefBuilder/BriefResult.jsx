import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="mb-4 text-3xl font-bold">{result.campaign_title}</h2>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        {(result.headlines || []).map((headline, index) => (
          <div key={`${headline}-${index}`} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs text-slate-500">Option {index + 1}</p>
            <p className="font-medium">{headline}</p>
          </div>
        ))}
      </div>
      <blockquote className="mb-4 border-l-4 border-indigo-500 pl-4 italic text-slate-700 dark:text-slate-300">
        {result.tone_guide}
      </blockquote>
      <div className="mb-4 flex flex-wrap gap-2">
        {(result.channels || []).map((channel) => (
          <span
            key={channel.name}
            className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          >
            {channel.name} {channel.budget_percentage}%
          </span>
        ))}
      </div>
      <p className="mb-4">{result.visual_direction}</p>
      <button type="button" onClick={exportPdf} className="rounded-md bg-indigo-600 px-4 py-2 text-white">
        Export PDF
      </button>
    </div>
  );
}

