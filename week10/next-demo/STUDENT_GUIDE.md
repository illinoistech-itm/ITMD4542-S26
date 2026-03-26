# Next.js App Router — Student Guide

This guide walks through the concepts demonstrated in this project. Each section points to specific files — open them alongside this guide as you explore.

---

## Running the project

```bash
npm run dev
```

Then open `http://localhost:3000`.

---

## Project File Structure

```text
app/
├── layout.tsx                    →  shared root layout (nav bar)
├── page.tsx                      →  /
├── not-found.tsx                 →  shown for any unmatched URL
├── about/
│   └── page.tsx                  →  /about
├── counter/
│   └── page.tsx                  →  /counter
├── dynamic/
│   └── [name]/
│       └── page.tsx              →  /dynamic/:name
├── todos/
│   └── page.tsx                  →  /todos
├── images/
│   └── page.tsx                  →  /images
├── api/
│   └── todos/
│       └── route.ts              →  GET /api/todos
├── dashboard/
│   ├── layout.tsx                →  nested layout (sidebar)
│   ├── template.tsx              →  remounts on every navigation
│   ├── loading.tsx               →  auto Suspense fallback
│   ├── error.tsx                 →  error boundary
│   ├── page.tsx                  →  /dashboard
│   └── settings/
│       └── page.tsx              →  /dashboard/settings
└── ui/
    ├── Counter.tsx               →  'use client' component
    └── SlowData.tsx              →  async server component (2s delay)
```

---

## 1 — File-System Routing

**File:** [app/about/page.tsx](app/about/page.tsx) → **Route:** `/about`

In Next.js, folders inside `app/` become URL segments. A `page.tsx` file inside a folder makes that route publicly accessible. There is no router config file — the folder structure *is* the router.

```text
app/page.tsx                →  /
app/about/page.tsx          →  /about
app/counter/page.tsx        →  /counter
app/dynamic/[name]/page.tsx →  /dynamic/:name
```

Try navigating to `/about` in the browser, then look at where the file lives in the project. The folder name equals the URL segment.

---

## 2 — Shared Layouts

**File:** [app/layout.tsx](app/layout.tsx)

A `layout.tsx` file wraps all pages at its level and below. The root layout at `app/layout.tsx` wraps every page in the app — it's where the nav bar lives.

Key things to notice:

- Layouts **do not remount** between navigations — they persist across page changes
- The `children` prop is where the current page's content renders
- The root layout must include `<html>` and `<body>` tags

Navigate between several pages and observe that the nav bar never disappears or flickers — it's rendered once and stays mounted.

---

## 3 — The `<Link>` Component

**File:** [app/layout.tsx](app/layout.tsx) (the `<nav>`)

Next.js provides a `<Link>` component that replaces `<a>` tags for internal navigation. It handles client-side transitions so pages switch without a full browser reload, and it prefetches linked pages in the background.

```tsx
import Link from "next/link"

<Link href="/about">About</Link>   // client-side nav, prefetched
<a href="/about">About</a>         // full page reload, no prefetch
```

Open the Network tab in DevTools and click a nav link — notice there is no full HTML document request, only a small data fetch for the new page content.

---

## 4 — Server vs Client Components

**Files:** [app/counter/page.tsx](app/counter/page.tsx) and [app/ui/Counter.tsx](app/ui/Counter.tsx)

By default, every component in Next.js is a **Server Component**. Server Components:

- Run only on the server
- Can `await` data directly
- Cannot use `useState`, `useEffect`, or event handlers
- Send zero JavaScript to the browser

To use interactivity, add `"use client"` at the top of the file. This marks it as a **Client Component**.

```tsx
// app/ui/Counter.tsx
"use client"                  // ← this makes it a Client Component
import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  // ...
}
```

Notice that `counter/page.tsx` has no `"use client"` directive — it's a Server Component that imports a Client Component. Only `Counter.tsx` ships JavaScript to the browser; the page wrapper stays on the server.

---

## 5 — Dynamic Routes

**File:** [app/dynamic/\[name\]/page.tsx](app/dynamic/[name]/page.tsx) → **Route:** `/dynamic/:name`

Wrapping a folder name in square brackets creates a dynamic segment. Whatever value appears in the URL at that position is passed to the page via `params`.

```tsx
export default async function DynamicPage(props: PageProps<"/dynamic/[name]">) {
  const { name } = await props.params
  // name = whatever is in the URL
}
```

Try navigating to `/dynamic/world`, then `/dynamic/your-name`. The same file handles every URL — the value just changes.

---

## 6 — Page Metadata

**Files:** [app/about/page.tsx](app/about/page.tsx) and [app/dynamic/\[name\]/page.tsx](app/dynamic/[name]/page.tsx)

Pages can export metadata that controls the browser tab title, description, and social share tags. Next.js reads this on the server and injects the correct `<head>` tags automatically.

**Static metadata** — a plain exported object, used when the title is fixed:

```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about this Next.js demo app.",
}
```

**Dynamic metadata** — an async function that receives the same `params` as the page, used when the title should reflect the URL:

```tsx
export async function generateMetadata(
  props: PageProps<"/dynamic/[name]">
): Promise<Metadata> {
  const { name } = await props.params
  return {
    title: `Dynamic page — ${name}`,
    description: `This is the page for the "${name}" segment.`,
  }
}
```

Navigate to `/dynamic/world` and look at the browser tab — it reads "Dynamic page — world". Navigate to `/dynamic/alice` — the tab updates. Open DevTools → Elements and find the `<title>` tag to see it changing. `generateMetadata` runs on the server and can `await` a database or API call just like the page component.

---

## 7 — API Routes (Route Handlers)

**File:** [app/api/todos/route.ts](app/api/todos/route.ts) → **Endpoint:** `GET /api/todos`

Route Handlers create API endpoints inside the same project as your UI. The file is named `route.ts` instead of `page.tsx`, and you export a function named after the HTTP method.

```ts
export async function GET() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/")
  const data = await response.json()
  return Response.json(data)
}
```

This uses the standard Web `Response` API — nothing Next.js-specific. Navigate directly to `/api/todos` in the browser to see the raw JSON response. Then visit `/todos` to see a page that fetches from that same endpoint.

The API route and the page are completely separate — any client (a mobile app, Postman, another website) could call `/api/todos` directly.

---

## 8 — Nested Layouts

**File:** [app/dashboard/layout.tsx](app/dashboard/layout.tsx)

You can add a `layout.tsx` inside any route folder. It wraps only that route and its children. Layouts nest — both the root layout and the dashboard layout are active on `/dashboard/*` pages simultaneously.

```text
RootLayout (app/layout.tsx)
  └── DashboardLayout (app/dashboard/layout.tsx)
        └── page.tsx
```

Navigate to `/dashboard` then `/dashboard/settings`. The sidebar comes from `DashboardLayout` and never moves, while the main content area is replaced by the current page.

---

## 9 — Templates vs Layouts

**File:** [app/dashboard/template.tsx](app/dashboard/template.tsx)

A `template.tsx` file looks identical to `layout.tsx` but behaves differently — it **remounts on every navigation** instead of persisting.

| | `layout.tsx` | `template.tsx` |
| --- | --- | --- |
| Remounts on navigation | No | Yes |
| State persists | Yes | No (resets) |
| Effects re-run | No | Yes |

Because the template remounts every time, any state it holds resets on each navigation. The template here is a `"use client"` component that captures the current time when it mounts:

```tsx
"use client"
const [mountedAt] = useState(() => new Date().toLocaleTimeString())
```

Navigate between `/dashboard` and `/dashboard/settings` and watch the timestamp in the bar update each time. The sidebar (from `layout.tsx`) never flickers — the layout stays mounted while the template remounts around it.

> `"use client"` on the template does not affect the nested pages. The `children` prop is already-rendered server output passed in from outside — those components remain Server Components.

---

## 10 — Special Files: `loading.tsx`, `error.tsx`, `not-found.tsx`

These files are picked up by Next.js automatically — no imports or wiring needed.

### `loading.tsx`

**File:** [app/dashboard/loading.tsx](app/dashboard/loading.tsx)

Creates an automatic `<Suspense>` boundary around the page. The content here is shown while the route is loading.

```tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

### `error.tsx`

**File:** [app/dashboard/error.tsx](app/dashboard/error.tsx)

Creates a React error boundary around the route. If anything inside throws during rendering, this component is shown as the fallback. Must be `"use client"` — React's error boundary API is client-only.

```tsx
"use client"
export default function Error({ error, unstable_retry }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  )
}
```

### `not-found.tsx`

**File:** [app/not-found.tsx](app/not-found.tsx)

Shown whenever a URL doesn't match any route. Try typing any unknown URL (e.g. `/banana`) — this file handles it automatically.

---

## 11 — Suspense

**Files:** [app/dashboard/page.tsx](app/dashboard/page.tsx) and [app/ui/SlowData.tsx](app/ui/SlowData.tsx)

`<Suspense>` lets you show fallback UI while a specific component loads, without blocking the rest of the page from rendering.

`SlowData.tsx` is an async Server Component with an artificial 2-second delay to simulate a slow database query:

```tsx
export default async function SlowData() {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const items = ["Buy groceries", "Walk the dog", "Ship the feature"]
  return <ul>...</ul>
}
```

In `dashboard/page.tsx` it's wrapped in `<Suspense>`:

```tsx
import { Suspense } from "react"
import SlowData from "@/app/ui/SlowData"

<Suspense fallback={<p>Fetching data…</p>}>
  <SlowData />
</Suspense>
```

Navigate to `/dashboard` — the heading and sidebar appear immediately while only the data section shows the fallback for 2 seconds. The rest of the page is never blocked.

`loading.tsx` is essentially Next.js wrapping the *entire page* in `<Suspense>` for you. Using `<Suspense>` directly gives you finer control — you can wrap individual components instead of whole routes.

---

## 12 — The `<Image>` Component

**File:** [app/images/page.tsx](app/images/page.tsx) → **Route:** `/images`

Next.js provides a built-in `<Image>` component that replaces `<img>`. It automatically optimizes images for each device, converts to modern formats (WebP/AVIF), and lazy-loads by default.

### Local images (from `/public`)

Files in the `/public` folder are served at the root URL. Pass the path as `src` along with explicit `width` and `height`:

```tsx
import Image from "next/image"

<Image
  src="/next.svg"
  alt="Next.js logo"
  width={180}
  height={38}
/>
```

### Remote images (external URLs)

Remote hostnames must be allowlisted in `next.config.ts` first. This prevents arbitrary external images from being proxied through your server.

```ts
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "picsum.photos" }
  ]
}
```

Then use it the same way:

```tsx
<Image
  src="https://picsum.photos/seed/nextjs/600/400"
  alt="A random photo"
  width={600}
  height={400}
/>
```

| | `<img>` | `<Image>` |
| --- | --- | --- |
| Format optimization | No | Yes — WebP/AVIF |
| Resizes for device | No | Yes |
| Lazy loads | Manual | Default |
| Prevents layout shift | No | Yes (reserves space) |

---

## Concept Summary

| Concept | File(s) | Route |
| --- | --- | --- |
| File-system routing | [app/about/page.tsx](app/about/page.tsx) | `/about` |
| Root layout + `<Link>` | [app/layout.tsx](app/layout.tsx) | all routes |
| Server Component | [app/counter/page.tsx](app/counter/page.tsx) | `/counter` |
| Client Component | [app/ui/Counter.tsx](app/ui/Counter.tsx) | — |
| Dynamic routes | [app/dynamic/\[name\]/page.tsx](app/dynamic/[name]/page.tsx) | `/dynamic/:name` |
| Page metadata | [app/about/page.tsx](app/about/page.tsx), [app/dynamic/\[name\]/page.tsx](app/dynamic/[name]/page.tsx) | — |
| API route handler | [app/api/todos/route.ts](app/api/todos/route.ts) | `GET /api/todos` |
| Nested layout | [app/dashboard/layout.tsx](app/dashboard/layout.tsx) | `/dashboard/*` |
| Template | [app/dashboard/template.tsx](app/dashboard/template.tsx) | `/dashboard/*` |
| Loading state | [app/dashboard/loading.tsx](app/dashboard/loading.tsx) | `/dashboard/*` |
| Error boundary | [app/dashboard/error.tsx](app/dashboard/error.tsx) | `/dashboard/*` |
| 404 page | [app/not-found.tsx](app/not-found.tsx) | unmatched URLs |
| Suspense | [app/dashboard/page.tsx](app/dashboard/page.tsx), [app/ui/SlowData.tsx](app/ui/SlowData.tsx) | `/dashboard` |
| Image component | [app/images/page.tsx](app/images/page.tsx) | `/images` |
