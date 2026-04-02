// JSON file database implementation.
// Reads and writes todos to data/todos.json on every operation.
// This is simple and works great for demos — swap it for a real database later.

import fs from 'fs/promises';
import path from 'path';
import type { Todo } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'todos.json');

async function readData(): Promise<Todo[]> {
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(content) as Todo[];
}

async function writeData(todos: Todo[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

export const db = {
  async getTodos(): Promise<Todo[]> {
    return readData();
  },

  async getTodoById(id: string): Promise<Todo | undefined> {
    const todos = await readData();
    return todos.find(t => t.id === id);
  },

  async createTodo(title: string): Promise<Todo> {
    const todos = await readData();
    const newTodo: Todo = { id: crypto.randomUUID(), title, completed: false };
    await writeData([...todos, newTodo]);
    return newTodo;
  },

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo> {
    const todos = await readData();
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Todo with id ${id} not found`);
    todos[index] = { ...todos[index], ...updates };
    await writeData(todos);
    return todos[index];
  },

  async deleteTodo(id: string): Promise<void> {
    const todos = await readData();
    await writeData(todos.filter(t => t.id !== id));
  },
};
