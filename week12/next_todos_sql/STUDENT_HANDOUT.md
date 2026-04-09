# Next.js Todos — SQL Demo (Student Reference)

This demo builds on the todos app from last class. The app itself is identical — same pages, same components, same server actions. The only thing that changes is the database layer. We're going to swap the JSON file out for two real SQL databases by writing one new file each time and changing one import.

---

## What's New in This Demo

| | Previous Demo | This Demo |
|---|---|---|
| Storage | `data/todos.json` (flat file) | SQLite (local) and Neon (cloud Postgres) |
| Queries | Read/write the whole array | Real SQL: SELECT, INSERT, UPDATE, DELETE |
| Setup | Nothing | Install a package, connect with a string |
| Secrets | None needed | Connection string stored in `.env.local` |

---

## The Abstraction Layer — Why It Matters Now

In the last demo we created this file:

```typescript
// lib/db.ts
export interface Database {
  getTodos(): Promise<Todo[]>;
  getTodoById(id: string): Promise<Todo | undefined>;
  createTodo(title: string): Promise<Todo>;
  updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
}

// ↓ Swap this import to change the database implementation
export { db } from './db-json';
```

Today we change that last line twice — once for SQLite, once for Neon. Every other file in the app stays untouched. That's the payoff of the abstraction.

---

## Environment Variables

Secrets like database passwords should never be written directly in code or committed to Git. Instead, we store them in a file called `.env.local`:

```
NEON_DB_CONNECTION=postgresql://user:password@host.neon.tech/dbname
```

**Rules for environment variables:**

- `.env.local` is always listed in `.gitignore` — it never gets committed
- Next.js loads it automatically when the dev server starts
- Access a variable in server-side code with `process.env.VARIABLE_NAME`
- If you add a new variable, restart the dev server for it to take effect

```typescript
// Reading an env var in server code
const connectionString = process.env.NEON_DB_CONNECTION!;
//                                                      ^ TypeScript non-null assertion
//                                                        tells TS "this is definitely set"
```

---

## Part 1 — SQLite

### What is SQLite?

A relational database stored in a single file. No server to install or run — just a `.db` file on disk. Real SQL, real tables, real queries.

### The implementation (`lib/db-sqlite.ts`)

```typescript
import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import type { Todo } from './types';

const DB_FILE = path.join(process.cwd(), 'data', 'todos.db');

const sqlite = new BetterSqlite3(DB_FILE);

// Create the table if it doesn't already exist.
// Runs once when this module is first imported.
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id        TEXT    PRIMARY KEY,
    title     TEXT    NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`);

function toTodo(row: { id: string; title: string; completed: number }): Todo {
  return { id: row.id, title: row.title, completed: row.completed === 1 };
}

export const db = {
  async getTodos(): Promise<Todo[]> {
    const rows = sqlite.prepare('SELECT * FROM todos').all() as {
      id: string; title: string; completed: number;
    }[];
    return rows.map(toTodo);
  },

  async getTodoById(id: string): Promise<Todo | undefined> {
    const row = sqlite.prepare('SELECT * FROM todos WHERE id = ?').get(id) as {
      id: string; title: string; completed: number;
    } | undefined;
    return row ? toTodo(row) : undefined;
  },

  async createTodo(title: string): Promise<Todo> {
    const id = crypto.randomUUID();
    sqlite.prepare('INSERT INTO todos (id, title, completed) VALUES (?, ?, 0)').run(id, title);
    return { id, title, completed: false };
  },

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo> {
    const current = await db.getTodoById(id);
    if (!current) throw new Error(`Todo with id ${id} not found`);
    const updated = { ...current, ...updates };
    sqlite
      .prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?')
      .run(updated.title, updated.completed ? 1 : 0, id);
    return updated;
  },

  async deleteTodo(id: string): Promise<void> {
    sqlite.prepare('DELETE FROM todos WHERE id = ?').run(id);
  },
};
```

### Key concepts

**`CREATE TABLE IF NOT EXISTS`**

This is safe to run every time the server starts. If the table already exists, it does nothing. If this is the first run, it creates the table. No migration files, no manual setup.

**Prepared statements and `?` placeholders**

```typescript
// Safe — ? is replaced at runtime by the database driver
sqlite.prepare('SELECT * FROM todos WHERE id = ?').get(id)

// NEVER do this — it allows SQL injection
sqlite.prepare(`SELECT * FROM todos WHERE id = '${id}'`).get()
```

`?` placeholders tell SQLite: "the actual value will come separately." This prevents SQL injection — an attacker can't escape out of the placeholder to run malicious SQL.

**SQLite has no boolean type**

SQLite stores `true` as `1` and `false` as `0`. The `toTodo` helper converts these back to real booleans:

```typescript
function toTodo(row: { id: string; title: string; completed: number }): Todo {
  return { id: row.id, title: row.title, completed: row.completed === 1 };
}
```

**`better-sqlite3` is synchronous**

Most database drivers are async (you `await` every query). `better-sqlite3` is synchronous — it blocks until the query is done. This is fine for a local file; the disk is fast enough. The methods are still typed as `async` to match the `Database` interface.

### Swapping in the SQLite adapter

In `lib/db.ts`, change:

```typescript
export { db } from './db-json';
```

to:

```typescript
export { db } from './db-sqlite';
```

Restart the dev server. Nothing else changes.

---

## Part 2 — Neon (Serverless Postgres)

### What is Neon?

Neon is a Postgres database in the cloud. You get a connection string; Neon handles the server. It's "serverless" in the sense that you don't manage or provision a database server yourself.

Postgres is a full relational database — the same engine used by most serious production applications.

### The implementation (`lib/db-neon.ts`)

```typescript
import { neon } from '@neondatabase/serverless';
import type { Todo } from './types';

const sql = neon(process.env.NEON_DB_CONNECTION!);

// Create the table if it doesn't already exist.
// This Promise resolves once on first import and stays resolved.
const ready = sql`
  CREATE TABLE IF NOT EXISTS todos (
    id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    title     TEXT    NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false
  )
`;

export const db = {
  async getTodos(): Promise<Todo[]> {
    await ready;
    const rows = await sql`SELECT id, title, completed FROM todos`;
    return rows as Todo[];
  },

  async getTodoById(id: string): Promise<Todo | undefined> {
    await ready;
    const rows = await sql`SELECT id, title, completed FROM todos WHERE id = ${id}`;
    return rows[0] as Todo | undefined;
  },

  async createTodo(title: string): Promise<Todo> {
    await ready;
    const rows = await sql`
      INSERT INTO todos (title)
      VALUES (${title})
      RETURNING id, title, completed
    `;
    return rows[0] as Todo;
  },

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo> {
    await ready;
    const current = await db.getTodoById(id);
    if (!current) throw new Error(`Todo with id ${id} not found`);
    const updated = { ...current, ...updates };
    const rows = await sql`
      UPDATE todos
      SET title = ${updated.title}, completed = ${updated.completed}
      WHERE id = ${id}
      RETURNING id, title, completed
    `;
    return rows[0] as Todo;
  },

  async deleteTodo(id: string): Promise<void> {
    await ready;
    await sql`DELETE FROM todos WHERE id = ${id}`;
  },
};
```

### Key concepts

**Tagged template literals**

`` sql`...` `` is a tagged template literal. It looks like a regular template string, but the `sql` function intercepts it before it becomes a string. Neon can see exactly which parts are SQL structure and which are values:

```typescript
// The sql function receives the template parts and values separately
const rows = await sql`SELECT * FROM todos WHERE id = ${id}`;
//                                                       ^^^
//                     Neon sees this as a parameter, not part of the SQL string
```

This prevents SQL injection automatically — there's no string concatenation happening.

**Postgres has a real boolean type**

Unlike SQLite's `0`/`1`, Postgres stores `true` and `false` natively. The `completed` field comes back already as a TypeScript `boolean` — no conversion needed.

**The database generates UUIDs**

In SQLite, we generate UUIDs with `crypto.randomUUID()`. In Neon, the database generates them:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

We use `RETURNING id, title, completed` to get the generated id back after an INSERT.

**The `ready` pattern**

```typescript
const ready = sql`CREATE TABLE IF NOT EXISTS todos (...)`;
```

`sql\`...\`` immediately starts the query and returns a Promise. We store that Promise in `ready`. Every method starts with `await ready`. The first call creates the table; every subsequent call sees an already-resolved Promise and continues instantly. This ensures the table exists before any other operation without repeated DDL.

**All queries are async**

Neon makes real network calls to a database in the cloud. Every query uses `await`. This is fundamentally different from SQLite, which reads a local file synchronously.

### Swapping in the Neon adapter

In `lib/db.ts`, change:

```typescript
export { db } from './db-sqlite';
```

to:

```typescript
export { db } from './db-neon';
```

Restart the dev server. The app now reads from and writes to your Neon Postgres database.

---

## Comparison: All Three Implementations

| | db-json.ts | db-sqlite.ts | db-neon.ts |
|---|---|---|---|
| Storage | `data/todos.json` | `data/todos.db` | Cloud Postgres |
| Language | JSON | SQL | SQL |
| Sync/Async | Async (file I/O) | Sync | Async (network) |
| Booleans | Native | 0 / 1 → convert | Native |
| UUID generation | `crypto.randomUUID()` | `crypto.randomUUID()` | `gen_random_uuid()` in DB |
| Setup | None | Install package | Install package + env var |

---

## SQL Quick Reference

The SQL used in this demo:

```sql
-- Create the table (only if it doesn't already exist)
CREATE TABLE IF NOT EXISTS todos (
  id   TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0
);

-- Read all rows
SELECT * FROM todos;

-- Read one row
SELECT * FROM todos WHERE id = 'some-uuid';

-- Insert a new row
INSERT INTO todos (id, title, completed) VALUES ('uuid', 'Buy milk', 0);

-- Update a row
UPDATE todos SET title = 'Buy oat milk', completed = 1 WHERE id = 'some-uuid';

-- Delete a row
DELETE FROM todos WHERE id = 'some-uuid';
```

---

## How to Run

```bash
# Install dependencies (already done in this project)
npm install

# Start the dev server
npm run dev
```

**For the Neon version only:** you need to create a `.env.local` file with your own Neon connection string. A template is included in the project:

```bash
# Copy the example file and fill in your connection string
cp .env.local.example .env.local
```

Then open `.env.local` and replace the placeholder with your connection string from the Neon dashboard. Restart the dev server after creating the file.

To switch between database implementations, change one line in `lib/db.ts`:

```typescript
// JSON file (no setup needed)
export { db } from './db-json';

// SQLite (local file — data/todos.db created automatically)
export { db } from './db-sqlite';

// Neon Postgres (requires NEON_DB_CONNECTION in .env.local)
export { db } from './db-neon';
```

Restart the dev server after switching.
