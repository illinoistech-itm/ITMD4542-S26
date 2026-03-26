// app/dashboard/settings/page.tsx → /dashboard/settings
// The DashboardLayout sidebar and DashboardTemplate both still apply here.
export default function SettingsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Navigate back to Overview. Notice the sidebar stays identical (layout persists),
        but the timestamp bar updates (template remounts).
      </p>
    </main>
  );
}
