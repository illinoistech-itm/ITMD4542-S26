import Counter from "@/app/ui/Counter";

// This PAGE is a Server Component (no 'use client').
// It imports Counter, which IS a Client Component.
// Only Counter's code ships to the browser — the rest stays on the server.
export default function CounterPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Client Components</h1>

      <p className="text-zinc-600 dark:text-zinc-400 mb-2">
        Every component in Next.js is a <strong>Server Component</strong> by default.
        To use <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">useState</code> or event handlers,
        add <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&quot;use client&quot;</code> at the top of the file.
      </p>

      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        This page is a Server Component. The counter below is a Client Component
        — only the interactive part sends JavaScript to the browser.
      </p>

      {/* Counter is a Client Component defined in app/ui/Counter.tsx */}
      <Counter />
    </main>
  );
}
