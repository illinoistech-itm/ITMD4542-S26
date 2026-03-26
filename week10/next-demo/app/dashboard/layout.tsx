import Link from "next/link";

// This is a NESTED layout. It only wraps /dashboard/* routes.
// The root layout (app/layout.tsx) still wraps everything — so both layouts apply here.
// Render order: RootLayout → DashboardLayout → Template → Page
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      {/* This sidebar persists across all /dashboard/* pages.
          Navigate between Overview and Settings — the sidebar does NOT remount. */}
      <aside className="w-48 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-3">
        <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Dashboard</p>
        <Link href="/dashboard" className="text-sm hover:underline">Overview</Link>
        <Link href="/dashboard/settings" className="text-sm hover:underline">Settings</Link>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
