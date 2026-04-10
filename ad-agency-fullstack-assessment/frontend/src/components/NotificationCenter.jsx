import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

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
        className="relative rounded-md bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-600 text-[10px] text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {alerts.length === 0 && <p className="p-2 text-sm text-slate-500">No alerts yet.</p>}
          {alerts.map((alert, index) => (
            <button
              key={`${alert.campaignId}-${alert.timestamp}-${index}`}
              type="button"
              onClick={() => markRead(index)}
              className={`mb-1 w-full rounded-md p-2 text-left text-sm ${
                alert.isRead ? "bg-slate-100 dark:bg-slate-800" : "bg-indigo-50 dark:bg-indigo-900/30"
              }`}
            >
              <p className="font-medium">{alert.campaignName}</p>
              <p>{alert.message}</p>
              <p className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

