"use client";
// 'use client' marks this as a Client Component.
// Without it, useState would throw an error — hooks only work on the client.

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded p-8 flex flex-col items-center gap-4">
      <p className="text-6xl font-bold">{count}</p>
      <div className="flex gap-3">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          −
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          +
        </button>
      </div>
    </div>
  );
}
