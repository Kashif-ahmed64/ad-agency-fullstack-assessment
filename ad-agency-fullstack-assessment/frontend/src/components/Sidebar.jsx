import { useMemo, useState } from "react";
import {
  ChevronLeft,
  FileText,
  LayoutDashboard,
  Settings,
  Target,
  Users
} from "lucide-react";

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
  const [collapsed, setCollapsed] = useState(false);

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
          "fixed left-0 top-0 z-40 h-screen bg-[#0f172a] text-slate-200 transition-all duration-200",
          "border-r border-slate-700/70",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-slate-700/70 px-4">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-100">AdAgency</p>
                <p className="text-xs text-slate-400">Campaign Intelligence</p>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <SectionLabel collapsed={collapsed} text="OVERVIEW" />
            <NavItem
              collapsed={collapsed}
              active={view === "dashboard"}
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard"
              onClick={() => onViewChange("dashboard")}
            />

            <SectionLabel collapsed={collapsed} text="CAMPAIGNS" />

            <div className="px-2">
              {!collapsed && <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Clients</p>}
              <ul className="mb-4 space-y-1">
                {clients.map((client) => (
                  <li key={client}>
                    <button
                      type="button"
                      onClick={() => onClientSelect(client)}
                      className={[
                        "mx-0 w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                        "hover:bg-slate-800",
                        selectedClient === client ? "bg-indigo-600 text-white" : "text-slate-300"
                      ].join(" ")}
                      title={client}
                    >
                      <span className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-slate-400" />
                        {!collapsed ? <span className="truncate">{client}</span> : <span className="truncate">{client.slice(0, 1)}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-2">
              {!collapsed && <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Campaigns</p>}
              <ul className="mb-6 space-y-1">
                {campaigns.map((campaign) => (
                  <li key={campaign.id}>
                    <button
                      type="button"
                      onClick={() => onCampaignSelect(campaign.id)}
                      className={[
                        "mx-0 w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                        "hover:bg-slate-800",
                        selectedCampaignId === campaign.id ? "bg-indigo-600 text-white" : "text-slate-300"
                      ].join(" ")}
                      title={campaign.name}
                    >
                      <span className="flex items-center gap-3">
                        <Target className="h-4 w-4 text-slate-400" />
                        {!collapsed ? <span className="truncate">{campaign.name}</span> : <span className="truncate">{campaign.id}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <SectionLabel collapsed={collapsed} text="SETTINGS" />
            <NavItem
              collapsed={collapsed}
              active={view === "brief-builder"}
              icon={<FileText className="h-4 w-4" />}
              label="Brief Builder"
              onClick={() => onViewChange("brief-builder")}
            />
            <NavItem
              collapsed={collapsed}
              active={false}
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
              onClick={() => {}}
            />
          </nav>

          <div className="border-t border-slate-700/70 p-2">
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="mx-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 transition-all duration-200 hover:bg-slate-800"
            >
              {!collapsed && <span>Collapse</span>}
              <ChevronLeft className={`h-4 w-4 transition-all duration-200 ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ collapsed, text }) {
  if (collapsed) return <div className="my-3 h-px bg-slate-700/70" />;
  return <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{text}</p>;
}

function NavItem({ collapsed, active, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "mx-2 mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
        "hover:bg-slate-800",
        active ? "bg-indigo-600 text-white" : "text-slate-300"
      ].join(" ")}
      title={label}
    >
      <span className={active ? "text-white" : "text-slate-400"}>{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

