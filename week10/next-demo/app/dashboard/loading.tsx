// loading.tsx automatically wraps the page in a <Suspense> boundary.
// This UI shows while the page is loading — no manual Suspense needed.
export default function Loading() {
  return (
    <div className="p-8 text-zinc-500">Loading...</div>
  );
}
