import Link from "next/link";

// This file is at app/page.tsx → it maps to the "/" route.
// It's a Server Component by default (no 'use client' needed).
export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Next.js Intro Demo</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-10">
        This app demonstrates the core concepts of the Next.js App Router.
        Click the links in the nav — or explore the pages below.
      </p>

      <ul className="space-y-4">
        <li>
          <Link href="/about" className="font-medium hover:underline">
            /about
          </Link>
          <p className="text-sm text-zinc-500">File-system routing — how folders become URLs</p>
        </li>
        <li>
          <Link href="/counter" className="font-medium hover:underline">
            /counter
          </Link>
          <p className="text-sm text-zinc-500">Server vs Client components — when to use &apos;use client&apos;</p>
        </li>
        <li>
          <Link href="/dynamic/world" className="font-medium hover:underline">
            /dynamic/world
          </Link>
          <p className="text-sm text-zinc-500">Dynamic routes — [name] matches any URL segment</p>
        </li>
        <li>
          <Link href="/todos" className="font-medium hover:underline">
            /todos
          </Link>
          <p className="text-sm text-zinc-500">API routes — route.ts creates a JSON endpoint at /api/todos</p>
        </li>
        <li>
          <Link href="/dashboard" className="font-medium hover:underline">
            /dashboard
          </Link>
          <p className="text-sm text-zinc-500">Nested layouts, templates, loading.tsx, error.tsx, not-found.tsx</p>
        </li>
      </ul>
    </main>
  );
}
