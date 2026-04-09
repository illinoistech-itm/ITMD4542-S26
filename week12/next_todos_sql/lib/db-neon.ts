// Neon serverless Postgres implementation.
// Connection string is read from NEON_DB_CONNECTION in .env.local.
// Creates the todos table automatically if it doesn't exist.
//
// Key differences from db-sqlite.ts:
// - All queries are async (real network calls to Postgres)
// - Postgres has a native boolean type — no 0/1 conversion needed
// - The database generates UUIDs via gen_random_uuid() — we don't call crypto.randomUUID()
// - Queries use tagged template literals (sql`...`) — neon handles parameterization automatically

import { neon } from '@neondatabase/serverless';
import type { Todo } from './types';

const sql = neon(process.env.NEON_DB_CONNECTION!);

// Create the table if it doesn't already exist.
// This Promise resolves once on first import and stays resolved — no repeated DDL calls.
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
