import { useEffect, useMemo, useState } from "react";
import source from "./data/campaigns.json";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import KPICard from "./components/KPICard";
import CampaignChart from "./components/CampaignChart";
import CampaignTable from "./components/CampaignTable";
import DateRangePicker from "./components/DateRangePicker";
import BriefBuilder from "./components/BriefBuilder/BriefBuilder";

function formatCompact(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

export default function App() {
  const [campaigns] = useState(source.campaigns);
  const [view, setView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRange, setSelectedRange] = useState("30d");
  const [customRange, setCustomRange] = useState({ from: "2026-03-01", to: "2026-03-30" });
  const [selectedClient, setSelectedClient] = useState(campaigns[0]?.client || "");
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("agency-theme") === "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("agency-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("agency-theme", "light");
    }
  }, [darkMode]);

  const totals = useMemo(() => {
    const impressions = campaigns.reduce((n, c) => n + c.impressions, 0);
    const clicks = campaigns.reduce((n, c) => n + c.clicks, 0);
    const conversions = campaigns.reduce((n, c) => n + c.conversions, 0);
    const spend = campaigns.reduce((n, c) => n + c.spend, 0);
    const ctr = impressions ? (clicks / impressions) * 100 : 0;
    const roas = spend ? conversions / spend : 0;
    return { impressions, clicks, conversions, spend, ctr, roas };
  }, [campaigns]);

  const chartData = useMemo(() => {
    const selected = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
    const metrics = selected?.metrics || [];
    if (!metrics.length) return [];
    const latestDate = metrics[metrics.length - 1].date;
    const latest = new Date(`${latestDate}T00:00:00`);
    return metrics.filter((point) => {
      const date = new Date(`${point.date}T00:00:00`);
      if (selectedRange === "7d") {
        const start = new Date(latest);
        start.setDate(start.getDate() - 6);
        return date >= start && date <= latest;
      }
      if (selectedRange === "custom") {
        const from = new Date(`${customRange.from}T00:00:00`);
        const to = new Date(`${customRange.to}T00:00:00`);
        return date >= from && date <= to;
      }
      return true;
    });
  }, [campaigns, selectedCampaignId, selectedRange, customRange]);

  const tableRows = useMemo(() => {
    const prepared = campaigns
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase()))
      .map((c) => ({
        ...c,
        ctr: c.impressions ? (c.clicks / c.impressions) * 100 : 0,
        roas: c.spend ? c.conversions / c.spend : 0
      }));
    return prepared.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (typeof av === "string" && typeof bv === "string") {
        return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortOrder === "asc" ? av - bv : bv - av;
    });
  }, [campaigns, search, sortBy, sortOrder]);

  function handleSort(column) {
    if (sortBy === column) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  const kpiCards = [
    { icon: "👁", label: "Total Impressions", value: formatCompact(totals.impressions), change: 8.4, positive: true },
    { icon: "🖱", label: "Total Clicks", value: formatCompact(totals.clicks), change: 6.2, positive: true },
    { icon: "📈", label: "CTR", value: `${totals.ctr.toFixed(2)}%`, change: 1.4, positive: true },
    { icon: "🎯", label: "Total Conversions", value: totals.conversions.toLocaleString(), change: 4.8, positive: true },
    { icon: "💵", label: "Total Spend", value: `$${totals.spend.toLocaleString()}`, change: 2.1, positive: false },
    { icon: "⚖", label: "ROAS", value: totals.roas.toFixed(2), change: 3.5, positive: true }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 transition-colors dark:bg-[#0f172a] dark:text-slate-100">
      <Sidebar
        campaigns={campaigns}
        selectedClient={selectedClient}
        selectedCampaignId={selectedCampaignId}
        onClientSelect={setSelectedClient}
        onCampaignSelect={setSelectedCampaignId}
        view={view}
        onViewChange={(next) => {
          setView(next);
          setMobileOpen(false);
        }}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main className="px-6 py-6 md:pl-24 md:pr-8 xl:pl-[17rem]">
        <Navbar onToggleSidebar={() => setMobileOpen(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode((d) => !d)} />

        {view === "dashboard" ? (
          <>
            <section className="mb-6 pt-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Campaign Dashboard</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Performance overview across clients and active campaigns</p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Mar 2026</p>
              </div>
            </section>

            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {kpiCards.map((card) => (
                <KPICard key={card.label} {...card} />
              ))}
            </section>

            <section className="mb-6">
              <DateRangePicker selected={selectedRange} onChange={setSelectedRange} customRange={customRange} onCustomRangeChange={setCustomRange} />
            </section>

            <section className="mb-6">
              <CampaignChart data={chartData} />
            </section>

            <section className="pb-6">
              <CampaignTable rows={tableRows} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} search={search} onSearch={setSearch} />
            </section>
          </>
        ) : (
          <div className="pt-6">
            <BriefBuilder />
          </div>
        )}
      </main>
    </div>
  );
}

