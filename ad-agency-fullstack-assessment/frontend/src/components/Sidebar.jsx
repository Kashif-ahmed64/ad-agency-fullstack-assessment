import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Settings2,
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
  const iconProps = { size: 20, strokeWidth: 1.5 };

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
          "fixed left-0 top-0 z-40 h-screen bg-[#0f172a] text-slate-200 transition-all duration-300",
          "border-r border-slate-700/70",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-slate-700/70 px-4">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-100">AdAgency</p>
                <p className="text-xs text-slate-400">Campaign Intelligence</p>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {collapsed ? (
              <div className="flex flex-col items-center gap-2 px-2">
                <IconNavItem
                  label="Dashboard"
                  active={view === "dashboard"}
                  icon={<LayoutDashboard {...iconProps} />}
                  onClick={() => onViewChange("dashboard")}
                />
                <IconNavItem
                  label="Clients"
                  active={false}
                  icon={<Users {...iconProps} />}
                  onClick={() => setCollapsed(false)}
                />
                <IconNavItem
                  label="Campaigns"
                  active={false}
                  icon={<Target {...iconProps} />}
                  onClick={() => setCollapsed(false)}
                />
                <IconNavItem
                  label="Brief Builder"
                  active={view === "brief-builder"}
                  icon={<FileText {...iconProps} />}
                  onClick={() => onViewChange("brief-builder")}
                />
                <IconNavItem
                  label="Settings"
                  active={view === "settings"}
                  icon={<Settings2 {...iconProps} />}
                  onClick={() => onViewChange("settings")}
                />
              </div>
            ) : (
              <>
                <SectionLabel collapsed={collapsed} text="OVERVIEW" />
                <NavItem
                  collapsed={collapsed}
                  active={view === "dashboard"}
                  icon={<LayoutDashboard {...iconProps} />}
                  label="Dashboard"
                  onClick={() => onViewChange("dashboard")}
                />

                <SectionLabel collapsed={collapsed} text="CAMPAIGNS" />

                <div className="px-2">
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Clients</p>
                  <ul className="mb-4 space-y-1">
                    {clients.map((client) => (
                      <li key={client}>
                        <button
                          type="button"
                          onClick={() => onClientSelect(client)}
                          className={[
                            "mx-2 flex w-[calc(100%-1rem)] cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 active:scale-[0.99]",
                            "hover:bg-slate-800",
                            selectedClient === client ? "bg-indigo-600 text-white" : "text-slate-300"
                          ].join(" ")}
                          title={client}
                        >
                          <span className={selectedClient === client ? "text-white" : "text-slate-400"}>
                            <Users {...iconProps} />
                          </span>
                          <span className="truncate">{client}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-2">
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Campaigns</p>
                  <ul className="mb-6 space-y-1">
                    {campaigns.map((campaign) => (
                      <li key={campaign.id}>
                        <button
                          type="button"
                          onClick={() => onCampaignSelect(campaign.id)}
                          className={[
                            "mx-2 flex w-[calc(100%-1rem)] cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 active:scale-[0.99]",
                            "hover:bg-slate-800",
                            selectedCampaignId === campaign.id ? "bg-indigo-600 text-white" : "text-slate-300"
                          ].join(" ")}
                          title={campaign.name}
                        >
                          <span className={selectedCampaignId === campaign.id ? "text-white" : "text-slate-400"}>
                            <Target {...iconProps} />
                          </span>
                          <span className="truncate">{campaign.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <SectionLabel collapsed={collapsed} text="SETTINGS" />
                <NavItem
                  collapsed={collapsed}
                  active={view === "brief-builder"}
                  icon={<FileText {...iconProps} />}
                  label="Brief Builder"
                  onClick={() => onViewChange("brief-builder")}
                />
                <NavItem
                  collapsed={collapsed}
                  active={view === "settings"}
                  icon={<Settings2 {...iconProps} />}
                  label="Settings"
                  onClick={() => onViewChange("settings")}
                />
              </>
            )}
          </nav>

          <div className="border-t border-slate-700/70 p-2">
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className={[
                "group relative mx-2 flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 transition-all duration-300 hover:bg-slate-800 active:scale-[0.99]",
                collapsed ? "justify-center" : ""
              ].join(" ")}
            >
              {!collapsed && <span>Collapse</span>}
              {collapsed ? <ChevronRight {...iconProps} /> : <ChevronLeft {...iconProps} />}

              {collapsed && (
                <span className="absolute left-16 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Expand
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ collapsed, text }) {
  if (collapsed) return null;
  return <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{text}</p>;
}

function NavItem({ collapsed, active, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "mx-2 mb-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 active:scale-[0.99]",
        "hover:bg-slate-800 hover:opacity-80",
        active ? "bg-indigo-600 text-white" : "text-slate-300"
      ].join(" ")}
      title={label}
    >
      <span className={active ? "text-white" : "text-slate-400"}>{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

function IconNavItem({ label, active, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative mx-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-all duration-300 active:scale-95",
        "hover:bg-slate-800",
        active ? "bg-indigo-600 text-white" : "text-slate-300"
      ].join(" ")}
      aria-label={label}
    >
      <span className={active ? "text-white" : "text-slate-300"}>{icon}</span>
      <span className="absolute left-16 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

