"use client";
// error.tsx MUST be a Client Component — React error boundaries require it.
// It wraps the page and catches any errors thrown during rendering.
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error;
  unstable_retry: () => void;
}) {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-zinc-500 mb-4">{error.message}</p>
      <button
        onClick={() => unstable_retry()}
        className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        Try again
      </button>
    </div>
  );
}
