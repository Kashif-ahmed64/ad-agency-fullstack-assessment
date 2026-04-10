import NotificationCenter from "./NotificationCenter";

export default function Navbar({ onToggleSidebar, darkMode, onToggleDarkMode }) {
  return (
    <header className="sticky top-0 z-20 mb-6 flex h-16 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-md bg-slate-100 text-slate-700 md:hidden dark:bg-slate-800 dark:text-slate-100"
          onClick={onToggleSidebar}
          aria-label="Open sidebar menu"
        >
          ☰
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Campaign Dashboard</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Advertising agency performance suite</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationCenter />
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

