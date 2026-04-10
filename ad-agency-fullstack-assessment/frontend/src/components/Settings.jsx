import { useEffect, useState } from "react";

export default function Settings({ darkMode, onToggleDarkMode }) {
  const [name, setName] = useState("");

  const [enableAlerts, setEnableAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [budgetThresholds, setBudgetThresholds] = useState(true);

  const [backendUrl, setBackendUrl] = useState("http://localhost:3001");
  const [aiUrl, setAiUrl] = useState("http://localhost:3002");

  // Ensure local state aligns with global theme on mount.
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100 dark:bg-slate-950">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Settings</h1>

      <Card title="Appearance">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-200">Dark Mode</p>
            <p className="mt-1 text-sm text-slate-400">Use the premium dark theme across the dashboard.</p>
          </div>
          <ToggleSwitch checked={darkMode} onChange={onToggleDarkMode} />
        </div>
      </Card>

      <Card title="Account">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Email">
            <input
              value="admin@agency.com"
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 opacity-80 focus:outline-none"
            />
          </Field>
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </Field>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95"
            onClick={() => {}}
          >
            Save
          </button>
        </div>
      </Card>

      <Card title="Notifications">
        <div className="space-y-6">
          <SettingRow
            label="Enable campaign alerts"
            description="Show real-time alerts in the notification center."
            checked={enableAlerts}
            onChange={() => setEnableAlerts((v) => !v)}
          />
          <SettingRow
            label="Email notifications"
            description="Send important alerts to your email."
            checked={emailNotifications}
            onChange={() => setEmailNotifications((v) => !v)}
          />
          <SettingRow
            label="Budget threshold alerts"
            description="Warn when spend approaches budget limits."
            checked={budgetThresholds}
            onChange={() => setBudgetThresholds((v) => !v)}
          />
        </div>
      </Card>

      <Card title="API Configuration">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Backend URL">
            <input
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </Field>
          <Field label="AI Service URL">
            <input
              value={aiUrl}
              onChange={(e) => setAiUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </Field>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95"
            onClick={() => {}}
          >
            Save
          </button>
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg shadow-black/20 transition-all duration-200 hover:border-slate-600">
      <h2 className="mb-4 text-base font-bold tracking-tight text-slate-100">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function SettingRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={[
        "relative h-7 w-12 cursor-pointer rounded-full transition-all duration-200 active:scale-95",
        checked ? "bg-indigo-600" : "bg-slate-600"
      ].join(" ")}
      aria-pressed={checked}
    >
      <span
        className={[
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200",
          checked ? "left-6" : "left-1"
        ].join(" ")}
      />
    </button>
  );
}

