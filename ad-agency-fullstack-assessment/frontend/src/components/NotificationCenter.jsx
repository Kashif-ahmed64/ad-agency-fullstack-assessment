import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Bell } from "lucide-react";

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io("ws://localhost:3003", { transports: ["websocket"] });
    socket.emit("join_campaign", { campaign_id: "all" });
    socket.on("alert", (alert) => {
      setAlerts((prev) => [{ ...alert, isRead: false }, ...prev].slice(0, 30));
    });
    return () => socket.disconnect();
  }, []);

  const unread = useMemo(() => alerts.filter((a) => !a.isRead).length, [alerts]);

  function markRead(index) {
    setAlerts((prev) => prev.map((a, i) => (i === index ? { ...a, isRead: true } : a)));
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-lg shadow-black/5 transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-100 dark:shadow-black/20 dark:hover:bg-slate-800"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40 transition-all duration-200">
          {alerts.length === 0 && (
            <div className="grid place-items-center gap-2 p-8 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300">
                <Bell className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-200">No notifications yet</p>
              <p className="text-xs text-slate-400">Alerts will appear here in real-time.</p>
            </div>
          )}
          {alerts.map((alert, index) => (
            <button
              key={`${alert.campaignId}-${alert.timestamp}-${index}`}
              type="button"
              onClick={() => markRead(index)}
              className={[
                "w-full border-b border-slate-800 p-4 text-left text-sm transition-all duration-200 hover:bg-slate-800",
                !alert.isRead ? "border-l-2 border-l-indigo-500" : "border-l-2 border-l-transparent"
              ].join(" ")}
            >
              <p className="font-medium text-slate-100">{alert.campaignName}</p>
              <p className="mt-1 text-slate-300">{alert.message}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(alert.timestamp).toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

