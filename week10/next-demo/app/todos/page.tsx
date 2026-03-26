"use client";
// This is a Client Component so we can use useState and useEffect
// to fetch from our API route after the page loads.

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetches from our own API route at /api/todos
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.slice(0, 10)); // show first 10 only
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">API Routes</h1>

      <p className="text-zinc-600 dark:text-zinc-400 mb-2">
        The route handler at{" "}
        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
          app/api/todos/route.ts
        </code>{" "}
        creates a GET endpoint at <strong>/api/todos</strong>.
      </p>

      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        This page fetches from it using <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">fetch("/api/todos")</code>.
        Open <strong>/api/todos</strong> directly in a new tab to see the raw JSON.
      </p>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 border border-zinc-200 dark:border-zinc-800 rounded px-4 py-3"
            >
              <span className={todo.completed ? "line-through text-zinc-400" : ""}>
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
