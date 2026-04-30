// Mongoose ODM implementation.
// Connection string is read from MONGODB_URI in .env.local.
//
// Key differences from db-mongo.ts (native driver):
// - Mongoose adds a Schema layer — you define the shape and validation rules for documents
// - The model enforces the schema on every save, not just in TypeScript
// - Queries return Mongoose Document objects (with methods like .save(), .toObject()) — we use .lean()
//   to get plain JavaScript objects, which is faster and matches what our interface expects
// - models.Todo || model(...) prevents "Cannot overwrite model" errors on Next.js hot reload:
//   Mongoose caches models by name; if the module re-runs, we reuse the cached model

import mongoose, { Schema, model, models, Types } from 'mongoose';
import type { Todo } from './types';

const ready = mongoose.connect(process.env.MONGODB_URI!, { dbName: 'todos_mongoose' });

// Interface for the document shape (without _id — Mongoose adds that).
// Passing it as the generic to Schema and model types all query results.
interface TodoDoc {
  title: string;
  completed: boolean;
}

// Schema defines the shape and validation rules for a todo document.
// Mongoose enforces this at runtime, not just at the TypeScript level.
const TodoSchema = new Schema<TodoDoc>({
  title:     { type: String,  required: true },
  completed: { type: Boolean, default: false },
});

// Reuse the model if it was already registered (prevents hot-reload errors in development).
const TodoModel = (models.Todo || model<TodoDoc>('Todo', TodoSchema)) as mongoose.Model<TodoDoc>;

// Mongoose documents have _id — convert to string id for our Todo interface.
// TodoDoc & { _id: Types.ObjectId } matches both lean query results and hydrated documents.
function toTodo(doc: TodoDoc & { _id: Types.ObjectId }): Todo {
  return { id: doc._id.toString(), title: doc.title, completed: doc.completed };
}

export const db = {
  async getTodos(): Promise<Todo[]> {
    await ready;
    const docs = await TodoModel.find({}).lean();
    return docs.map(toTodo);
  },

  async getTodoById(id: string): Promise<Todo | undefined> {
    await ready;
    const doc = await TodoModel.findById(id).lean();
    return doc ? toTodo(doc) : undefined;
  },

  async createTodo(title: string): Promise<Todo> {
    await ready;
    const doc = await TodoModel.create({ title });
    return toTodo(doc);
  },

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo> {
    await ready;
    const doc = await TodoModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    if (!doc) throw new Error(`Todo with id ${id} not found`);
    return toTodo(doc);
  },

  async deleteTodo(id: string): Promise<void> {
    await ready;
    await TodoModel.findByIdAndDelete(id);
  },
};
