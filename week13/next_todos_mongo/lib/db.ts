import type { Todo } from "./types";

// Database abstraction interface.
// All database implementations must satisfy this contract.
// To swap to a different database (e.g. Postgres, Prisma), create a new
// implementation file and change the import below — no other code changes needed.
export interface Database {
  getTodos(): Promise<Todo[]>;
  getTodoById(id: string): Promise<Todo | undefined>;
  createTodo(title: string): Promise<Todo>;
  updateTodo(id: string, updates: Partial<Omit<Todo, "id">>): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
}

// ↓ Swap this import to change the database implementation
// export { db } from './db-json';
// export { db } from './db-sqlite';
// export { db } from './db-neon';
// export { db } from "./db-mongo";
export { db } from "./db-mongoose";
