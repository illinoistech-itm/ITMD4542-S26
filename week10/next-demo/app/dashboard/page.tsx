import { Suspense } from "react";
import SlowData from "@/app/ui/SlowData";

// app/dashboard/page.tsx → /dashboard
// Wrapped by: RootLayout → DashboardLayout → DashboardTemplate → this page
export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-2">
        The sidebar comes from <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">layout.tsx</code> — it persists and does not remount.
        The timestamp bar above comes from <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">template.tsx</code> — it remounts on every navigation.
      </p>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-1">Suspense demo</h2>
        <p className="text-sm text-zinc-500 mb-4">
          SlowData takes 2 seconds to load. The page renders immediately —
          only this section waits. The fallback below shows until it&apos;s ready.
        </p>
        {/* <Suspense> shows the fallback while SlowData is loading.
            Without Suspense, the entire page would wait for SlowData. */}
        <Suspense fallback={<p className="text-zinc-400 text-sm">Fetching data…</p>}>
          <SlowData />
        </Suspense>
      </div>
    </main>
  );
}
