import { useMemo } from "react";

export default function Sidebar({
  campaigns,
  selectedClient,
  selectedCampaignId,
  onClientSelect,
  onCampaignSelect,
  view,
  onViewChange,
  mobileOpen,
  onClose
}) {
  const clients = useMemo(() => [...new Set(campaigns.map((c) => c.client))], [campaigns]);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label="Close menu overlay"
          onClick={onClose}
        />
      )}
      <aside
        className={[
          "fixed left-0 top-0 z-40 h-screen border-r border-slate-800 bg-slate-900 text-slate-200 transition-all duration-200",
          "w-72 xl:w-72 lg:w-20",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-indigo-500 font-bold text-white">
              A
            </div>
            <div className="lg:hidden xl:block">
              <p className="text-sm font-semibold">Aether Agency</p>
              <p className="text-xs text-slate-400">Campaign Intelligence</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:hidden xl:block">
              Clients
            </p>
            <ul className="mb-6 space-y-1">
              {clients.map((client) => (
                <li key={client}>
                  <button
                    type="button"
                    onClick={() => onClientSelect(client)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition ${
                      selectedClient === client ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
                    }`}
                    title={client}
                  >
                    <span className="truncate lg:hidden xl:block">{client}</span>
                    <span className="hidden lg:block xl:hidden">{client.slice(0, 1)}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:hidden xl:block">
              Campaigns
            </p>
            <ul className="mb-6 space-y-1">
              {campaigns.map((campaign) => (
                <li key={campaign.id}>
                  <button
                    type="button"
                    onClick={() => onCampaignSelect(campaign.id)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition ${
                      selectedCampaignId === campaign.id ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
                    }`}
                    title={campaign.name}
                  >
                    <span className="truncate lg:hidden xl:block">{campaign.name}</span>
                    <span className="hidden lg:block xl:hidden">{campaign.id}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:hidden xl:block">
              Settings
            </p>

            <button
              type="button"
              onClick={() => onViewChange("dashboard")}
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left text-sm ${
                view === "dashboard" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="lg:hidden xl:block">Dashboard</span>
              <span className="hidden lg:block xl:hidden">D</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange("brief-builder")}
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left text-sm ${
                view === "brief-builder" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="lg:hidden xl:block">Brief Builder</span>
              <span className="hidden lg:block xl:hidden">B</span>
            </button>

            <button
              type="button"
              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
            >
              <span className="lg:hidden xl:block">Preferences</span>
              <span className="hidden lg:block xl:hidden">…</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}

