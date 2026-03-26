"use client";

// template.tsx looks just like layout.tsx, but behaves differently:
// - layout.tsx  → persists across navigations, does NOT remount, effects don't re-run
// - template.tsx → remounts on EVERY navigation, resetting state and re-running effects
//
// Must be a Client Component to demonstrate this — state initializers only run in the browser.
// The timestamp is captured in a lazy useState initializer, which runs once per mount.
// Navigate between Overview and Settings — the timestamp updates each time.
//
// Note: "use client" here does NOT affect the nested pages — children are passed in as
// already-rendered server output and remain Server Components.

import { useState } from "react";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initializer runs once when the component mounts on the client.
  // Because this is a "use client" component, it never runs on the server,
  // so there's no hydration mismatch.
  const [mountedAt] = useState(() => new Date().toLocaleTimeString());

  return (
    <div>
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-8 py-2 text-xs text-zinc-400">
        template.tsx mounted at:{" "}
        <span className="font-mono">{mountedAt ?? "—"}</span>
        {" "}— navigate between pages and watch this update
      </div>
      {children}
    </div>
  );
}
