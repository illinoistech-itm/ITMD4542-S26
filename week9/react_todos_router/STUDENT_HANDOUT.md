# React Router — What Changed and Why

## Overview

This app started as `react_todos_local_edit`, which had:

- A single page with all todos
- An inline edit panel that appeared when you clicked a todo title
- A `selectedTodo` state in `App.tsx` that controlled which panel was open

In this version we replaced that with **React Router**, so each view has its own URL. The core logic (add, toggle, delete, update, localStorage, API fetch) is unchanged — we only changed how navigation works.

---

## Step 1 — Install the package

```bash
npm i react-router
```

Everything we need ships in one package. Import from `'react-router'` (not `'react-router-dom'`).

---

## Step 2 — `main.tsx` — Wrap the app in `<BrowserRouter>`

**Before:**
```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**After:**
```tsx
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

`BrowserRouter` goes at the very top of the tree so every component below it can use router hooks like `useParams` and `useNavigate`.

---

## Step 3 — `TodoDetail.tsx` — Refactor from panel to route page

This was the biggest change. The edit panel used to live inline inside `App.tsx` and appear/disappear based on `selectedTodo` state. Now it's its own full route component.

**Key changes:**
- Uses `useParams()` to read the todo `id` from the URL (`/todos/:id`)
- Uses `useNavigate()` to go back after saving or cancelling
- Receives `todos` and `onUpdate` as regular props (passed from `App` via the `element` prop on `<Route>`)

```tsx
import { useParams, useNavigate } from 'react-router';

function TodoDetail({ todos, onUpdate }: TodoDetailProps) {
  const { id } = useParams();          // reads ":id" from the URL
  const navigate = useNavigate();

  const todo = todos.find(t => t.id === Number(id));  // id is a string — convert it!

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(todo.id, title.trim());
    navigate(-1);                      // go back to wherever we came from
  };

  return (/* edit form */);
}
```

`navigate(-1)` works like the browser back button — it sends the user back to whatever page they were on, whether that's Active or Completed todos.

---

## Step 4 — `TodoItem.tsx` — Replace `onSelect` with `<Link>`

**Before:** The title was a `<span>` with an `onClick` that called `onSelect(todo)`.

**After:** The title is a `<Link>` that navigates to the edit route.

```tsx
import { Link } from 'react-router';

// Before
<span onClick={() => onSelect(todo)}>{todo.title}</span>

// After
<Link to={`/todos/${todo.id}`}>{todo.title}</Link>
```

No more callback needed — clicking the link just changes the URL, and the router does the rest.

---

## Step 5 — `TodoList.tsx` — Remove `onSelect` prop

Since `TodoItem` no longer needs an `onSelect` callback, it was removed from `TodoList` as well. The props interface is now simpler:

```tsx
interface TodoListProps {
  title: string;
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  // onSelect is gone
}
```

---

## Step 6 — `App.tsx` — Add routing, remove `selectedTodo`

This file had the most lines changed but most of it is straightforward.

**What was removed:**
- `selectedTodo` state
- `handleSelectTodo` callback
- The inline `TodoDetail` panel in the JSX
- Passing `onSelect` down to `TodoList`

**What was added:**

```tsx
import { Routes, Route, NavLink } from 'react-router';

// Split the list into two filtered arrays
const incompleteTodos = todos.filter(todo => !todo.completed);
const completedTodos = todos.filter(todo => todo.completed);

// NavLink tabs with active styling via a className function
const navLinkClass = ({ isActive }) =>
  `px-4 py-2 ... ${isActive ? 'bg-white text-blue-600' : 'text-gray-600'}`;

// In the JSX:
<nav>
  <NavLink to="/" end className={navLinkClass}>Active Todos</NavLink>
  <NavLink to="/completed" className={navLinkClass}>Completed Todos</NavLink>
</nav>

<Routes>
  <Route path="/"          element={<TodoList todos={incompleteTodos} ... />} />
  <Route path="/completed" element={<TodoList todos={completedTodos} ... />} />
  <Route path="/todos/:id" element={<TodoDetail todos={todos} onUpdate={handleUpdateTodo} />} />
</Routes>
```

Props are passed directly in the `element` JSX — no new APIs, just regular prop drilling.

---

## The Big Idea: URL as State

The core concept this refactor teaches:

| Before | After |
|--------|-------|
| `selectedTodo` state in `App` | `/todos/:id` in the URL |
| Panel shown/hidden by state | Component swapped by the router |
| Selection lost on refresh | URL is bookmarkable and shareable |
| Back button does nothing | Back button works correctly |

**Navigational state belongs in the URL, not in component state.**

---

## Router Hooks Summary

| Hook / Component | Where used | What it does |
|-----------------|-----------|-------------|
| `BrowserRouter` | `main.tsx` | Enables routing for the whole app |
| `Routes` / `Route` | `App.tsx` | Maps URL paths to components |
| `NavLink` | `App.tsx` | Like `<Link>` but knows if it's active |
| `Link` | `TodoItem.tsx` | Navigates without a page reload |
| `useParams()` | `TodoDetail.tsx` | Reads `:id` from the URL |
| `useNavigate()` | `TodoDetail.tsx` | Programmatic navigation (back button) |

---

## Common Gotchas

**`useParams()` returns strings, not numbers**
Always convert: `todos.find(t => t.id === Number(id))`

**The `/` NavLink stays active on every page**
Add the `end` prop: `<NavLink to="/" end ...>` — without it, `/` matches every path.

**Hooks throw "may be used only in context of a Router"**
Make sure `<BrowserRouter>` wraps `<App>` in `main.tsx`.

**Wrong package name**
Use `npm i react-router`, not `npm i react-router-dom`. As of v7, everything ships in one package.
