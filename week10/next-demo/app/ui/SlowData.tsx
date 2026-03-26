// This is an async Server Component — it runs on the server and can await data.
// The 2-second delay simulates a slow database query or API call.
// Wrap it in <Suspense> so the rest of the page doesn't have to wait.
async function slowFetch() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return ["Buy groceries", "Walk the dog", "Ship the feature"];
}

export default async function SlowData() {
  const items = await slowFetch();

  return (
    <ul className="space-y-2 mt-4">
      {items.map((item) => (
        <li
          key={item}
          className="border border-zinc-200 dark:border-zinc-800 rounded px-4 py-2 text-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
