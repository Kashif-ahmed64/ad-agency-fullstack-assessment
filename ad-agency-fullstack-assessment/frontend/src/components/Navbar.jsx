import { Menu, Moon, Sun, UserCircle } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

export default function Navbar({ onToggleSidebar, darkMode, onToggleDarkMode }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur transition-all duration-200 dark:border-slate-700 dark:bg-[#0f172a]/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-lg shadow-black/5 transition-all duration-200 hover:bg-slate-50 active:scale-95 md:hidden dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-100 dark:hover:bg-slate-800"
          onClick={onToggleSidebar}
          aria-label="Open sidebar menu"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">AdAgency</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationCenter />
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-lg shadow-black/5 transition-all duration-200 hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          <span className="hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
        </button>

        <button
          type="button"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-lg shadow-black/5 transition-all duration-200 hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="User"
        >
          <UserCircle size={20} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}

