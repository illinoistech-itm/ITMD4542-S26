// This file lives at app/about/page.tsx
// That single folder + file is all it takes to create the /about route.
// No router config, no imports — just a folder and a page.tsx.

import type { Metadata } from "next";

// Static metadata — a plain exported object.
// Next.js reads this on the server and injects the appropriate <head> tags.
export const metadata: Metadata = {
  title: "About",
  description: "Learn about this Next.js demo app.",
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">About</h1>

      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        This page lives at <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">app/about/page.tsx</code> and
        is automatically available at <strong>/about</strong>.
      </p>

      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4 font-mono text-sm">
        <p className="text-zinc-400 mb-2"># Folder structure → URL</p>
        <p>app/page.tsx           →  /</p>
        <p>app/about/page.tsx     →  /about</p>
        <p>app/counter/page.tsx   →  /counter</p>
        <p>app/dynamic/[name]/page.tsx  →  /dynamic/:name</p>
      </div>

      <p className="mt-6 text-zinc-600 dark:text-zinc-400">
        This is a <strong>Server Component</strong> — it runs on the server only.
        It has no state, no event handlers, and sends zero JavaScript to the browser.
      </p>
    </main>
  );
}
