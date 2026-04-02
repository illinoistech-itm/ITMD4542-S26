# Next.js Todos App — Student Reference

This app is a full-stack todos application built with Next.js App Router. Unlike our previous React demos where everything ran in the browser, this app runs most of its logic on the server. The browser only receives HTML and the small amount of JavaScript needed for interactivity.

---

## What the App Does

| Route | What you see |
|---|---|
| `/` | Active (incomplete) todos |
| `/completed` | Completed todos |
| `/todo/:id` | Detail page — edit a todo's title |

From any page you can add a new todo using the form in the header. Checking a checkbox marks a todo complete or incomplete. Completed todos have a delete button. Clicking a todo's title takes you to the edit page.

---

## File Structure

```text
app/
├── layout.tsx          →  the shell: header, nav, add form
├── page.tsx            →  / — active todos
├── actions.ts          →  all server actions (mutations)
├── completed/
│   └── page.tsx        →  /completed
└── todo/[id]/
    └── page.tsx        →  /todo/:id — edit page

components/
├── NavLink.tsx         →  nav link with active styling
├── AddTodoForm.tsx     →  add todo form
├── TodoItem.tsx        →  a single todo row
└── EditTodoForm.tsx    →  edit title form

lib/
├── types.ts            →  the Todo type
├── db.ts               →  database interface (the abstraction)
└── db-json.ts          →  reads/writes data/todos.json

data/
└── todos.json          →  the "database"
```

---

## Key Concept: Server vs Client Components

Next.js has two kinds of components. The choice determines where the code runs.

### Server Components (the default)

Every component is a Server Component unless you say otherwise. They run on the server, can `await` data directly, and send zero JavaScript to the browser.

```tsx
// app/page.tsx — a Server Component
export default async function HomePage() {
  const todos = await db.getTodos();  // runs on the server, reads the file
  // ...returns HTML
}
```

You **cannot** use `useState`, `useEffect`, or event handlers in a Server Component.

### Client Components

Adding `'use client'` at the top of a file makes it a Client Component. It runs in the browser and can use hooks and event handlers — but it cannot `await` data directly.

```tsx
'use client';  // ← this line makes it a Client Component

import { useState } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);  // ✅ allowed in client components
  // ...
}
```

**Rule of thumb:** Use a Server Component by default. Only add `'use client'` when you need interactivity (event handlers, `useState`, `useEffect`).

### In this app

| File | Type | Why |
|---|---|---|
| `app/page.tsx` | Server | Reads todos from database |
| `app/completed/page.tsx` | Server | Reads todos from database |
| `app/todo/[id]/page.tsx` | Server | Reads one todo from database |
| `app/layout.tsx` | Server | No interactivity needed |
| `components/NavLink.tsx` | Client | Uses `usePathname()` hook |
| `components/AddTodoForm.tsx` | Client | Uses `useRef`, `useTransition` |
| `components/TodoItem.tsx` | Client | Has checkbox and button handlers |
| `components/EditTodoForm.tsx` | Client | Has form submit handler |

---

## Key Concept: Server Actions

Server Actions are functions that **always run on the server**, no matter where they're called from. Mark a file with `'use server'` at the top and every exported function becomes a server action.

```ts
// app/actions.ts
'use server';

export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string;
  await db.createTodo(title.trim());
  revalidatePath('/');
  redirect('/');
}
```

You can call a server action from a form's `action` prop:

```tsx
<form action={addTodo}>
  <input name="title" />
  <button type="submit">Add</button>
</form>
```

When the form submits, React serializes the form fields into a `FormData` object and sends it to the server. The function runs there — next to the database — and the browser never sees the database code.

### The four actions in this app

| Action | What it does |
|---|---|
| `addTodo(formData)` | Creates a new todo, redirects to `/` |
| `toggleTodo(id)` | Flips `completed` on a todo |
| `deleteTodo(id)` | Removes a todo |
| `updateTodo(id, formData)` | Updates the title, redirects to `/` |

### `revalidatePath`

After a mutation, Next.js needs to know the page data has changed. `revalidatePath('/')` tells Next.js: "regenerate the `/` page on the next request." Without it, the page would show stale data.

### `redirect`

Calling `redirect('/')` inside a server action navigates the user to that path after the action completes. It works by throwing a special error that Next.js intercepts — so never call it inside a `try/catch`.

---

## Key Concept: The Database Abstraction Layer

The app uses a simple pattern to keep database code separate from the rest of the app.

`lib/db.ts` defines what a database must be able to do (the interface):

```ts
export interface Database {
  getTodos(): Promise<Todo[]>;
  getTodoById(id: string): Promise<Todo | undefined>;
  createTodo(title: string): Promise<Todo>;
  updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
}
```

`lib/db-json.ts` is the actual implementation — it reads and writes `data/todos.json`.

The rest of the app only ever imports `db` from `lib/db.ts` and calls methods like `db.getTodos()`. It never touches the file system directly.

**Why this matters:** If you wanted to swap to a real database (MongoDB, Postgres), you'd write a new implementation file and change one import line in `lib/db.ts`. Every page and action would keep working without any changes.

### Why string IDs?

`Todo.id` is a `string`, not a `number`. New todos get a UUID from `crypto.randomUUID()`:

```ts
const newTodo = { id: crypto.randomUUID(), title, completed: false };
// e.g. "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

This matches what real databases produce — MongoDB uses ObjectId strings, and PostgreSQL can use UUID columns. It also means the URL param (`/todo/a1b2c3d4-...`) can be passed directly to the database without any type conversion.

---

## Key Concept: `useTransition`

When a client component calls a server action, there's a round-trip to the server. `useTransition` gives you a way to track that and update the UI while it's in flight.

```tsx
'use client';

import { useTransition } from 'react';
import { toggleTodo } from '@/app/actions';

export default function TodoItem({ todo }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleTodo(todo.id);  // server action call
    });
  }

  return (
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={handleToggle}
      disabled={isPending}  // disabled while the server is processing
    />
  );
}
```

`isPending` is `true` from the moment you call `startTransition` until the server action finishes. Use it to disable buttons, show spinners, or dim items.

---

## Key Concept: The `.bind()` Pattern

Server actions that need extra arguments (beyond `FormData`) use `.bind()`:

```tsx
// EditTodoForm.tsx
const updateTodoWithId = updateTodo.bind(null, todo.id);

// Now updateTodoWithId only needs formData — the id is already baked in
<form action={(formData) => { await updateTodoWithId(formData); }}>
```

The server action signature is:
```ts
export async function updateTodo(id: string, formData: FormData) { ... }
```

`.bind(null, todo.id)` creates a new function where `id` is pre-filled. The form only needs to send the title field — there's no hidden input needed for the id.

---

## Key Concept: Dynamic Routes

The `[id]` folder name in `app/todo/[id]/page.tsx` creates a dynamic route. Whatever appears in the URL at that position becomes available as `params.id`.

```tsx
// app/todo/[id]/page.tsx
export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;  // e.g. "a1b2c3d4-..."
  const todo = await db.getTodoById(id);

  if (!todo) notFound();  // renders the 404 page
  // ...
}
```

In this version of Next.js, `params` is a `Promise` — you must `await` it before reading the values.

---

## How Data Flows Through the App

```
data/todos.json
      ↓
lib/db-json.ts  (reads/writes the file)
      ↓
lib/db.ts       (abstraction — the rest of the app uses this)
      ↓
┌─────────────────────────────────────┐
│  Server Components (pages)          │
│  await db.getTodos()                │
│  → render HTML → sent to browser   │
└─────────────────────────────────────┘
      ↓ (user clicks something)
┌─────────────────────────────────────┐
│  Client Components                  │
│  call server actions                │
└─────────────────────────────────────┘
      ↓
┌─────────────────────────────────────┐
│  Server Actions (app/actions.ts)    │
│  await db.updateTodo(...)           │
│  revalidatePath('/') ← stale!       │
│  redirect('/')                      │
└─────────────────────────────────────┘
      ↓ (back to top — page re-renders with fresh data)
```

---

## Quick Reference

### Patterns you'll see in every file

| Pattern | Meaning |
|---|---|
| `async function Page()` | Server Component that fetches data |
| `'use client'` at top | Client Component — runs in browser |
| `'use server'` at top | Server Actions file |
| `await db.getTodos()` | Read from database (server only) |
| `revalidatePath('/')` | Mark a page's data as stale |
| `redirect('/')` | Navigate after a mutation |
| `notFound()` | Render the 404 page |
| `useTransition()` | Track a pending server action call |
| `fn.bind(null, id)` | Pre-fill a server action argument |
| `params: Promise<{ id: string }>` | Dynamic route param (must be awaited) |

### Common mistakes

**Using `<a href>` instead of `<Link>`**
`<a>` causes a full page reload. Always use `<Link href>` from `next/link` for internal navigation.

**Calling `redirect()` inside a try/catch**
`redirect()` throws a special error. If you catch it, the redirect won't happen. Keep `redirect()` outside any `try/catch` block.

**Using `useState` in a Server Component**
If you get an error about hooks, check whether your file needs `'use client'` at the top.

**Forgetting `revalidatePath` in a server action**
If the page doesn't update after a mutation, a missing `revalidatePath` call is usually the reason.
