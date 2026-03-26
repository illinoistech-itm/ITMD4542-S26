import Link from "next/link";

// not-found.tsx at the app root catches ALL unmatched routes.
// Try visiting any URL that doesn't exist — this page appears.
// You can also create not-found.tsx inside a subfolder to scope it to that route.
export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">404 — Page Not Found</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        This file is at <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">app/not-found.tsx</code>.
        It shows automatically for any URL that doesn&apos;t match a route.
      </p>
      <Link href="/" className="text-sm font-medium hover:underline">
        ← Go home
      </Link>
    </main>
  );
}
