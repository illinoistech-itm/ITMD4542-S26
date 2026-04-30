// SQLite database implementation using better-sqlite3.
// Uses a local file at data/todos.db.
// Creates the database file and table automatically on first run.
//
// Key difference from db-json.ts:
// - better-sqlite3 is synchronous (no await needed for queries)
// - We still return Promises to match the Database interface
// - SQLite stores booleans as 0/1 integers — we convert on the way out

import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import type { Todo } from './types';

const DB_FILE = path.join(process.cwd(), 'data', 'todos.db');

const sqlite = new BetterSqlite3(DB_FILE);

// Create the table if it doesn't already exist.
// This runs once when the module is first imported.
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id        TEXT    PRIMARY KEY,
    title     TEXT    NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`);

// SQLite has no boolean type — it stores 0 or 1.
// This helper converts a raw row into the Todo shape our app expects.
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
