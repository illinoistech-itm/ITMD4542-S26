// app/images/page.tsx → route: /images
//
// Demonstrates the Next.js <Image> component with:
//   1. A local image served from the /public folder
//   2. A remote image from an external URL (requires next.config.ts remotePatterns)

import Image from "next/image";

export default function ImagesPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 space-y-16">
      <h1 className="text-3xl font-bold">next/image</h1>

      {/* ── Local image ──────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Local image (from /public)</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          Files in the <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/public</code> folder
          are served at the root URL. Pass a path string as <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">src</code> —
          you must provide <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">width</code> and{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">height</code>.
        </p>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded p-4 inline-block">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            className="dark:invert"
          />
        </div>
        <pre className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4 text-sm overflow-x-auto">{`import Image from "next/image"

<Image
  src="/next.svg"
  alt="Next.js logo"
  width={180}
  height={38}
/>`}</pre>
      </section>

      {/* ── Remote image ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Remote image (external URL)</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          Remote images require the hostname to be allowlisted in{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">next.config.ts</code> under{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">images.remotePatterns</code>.
          Next.js resizes and optimizes the image on the server — the browser always receives a
          correctly-sized WebP.
        </p>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden w-fit">
          <Image
            src="https://picsum.photos/seed/nextjs/600/400"
            alt="A random placeholder photo"
            width={600}
            height={400}
          />
        </div>
        <pre className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4 text-sm overflow-x-auto">{`// next.config.ts — allowlist the hostname first
images: {
  remotePatterns: [
    { protocol: "https", hostname: "picsum.photos" }
  ]
}

// then use it like any other <Image>
<Image
  src="https://picsum.photos/seed/nextjs/600/400"
  alt="A random placeholder photo"
  width={600}
  height={400}
/>`}</pre>
      </section>

      {/* ── Key benefits ─────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Why use next/image?</h2>
        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1 text-sm">
          <li>Serves modern formats (WebP / AVIF) automatically</li>
          <li>Resizes to fit the device — no oversized downloads</li>
          <li>Lazy-loads by default — only fetches when near the viewport</li>
          <li>Reserves space before load — prevents layout shift (CLS)</li>
        </ul>
      </section>
    </main>
  );
}
