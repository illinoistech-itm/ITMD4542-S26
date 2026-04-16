// MongoDB native driver implementation.
// Connection string is read from MONGODB_URI in .env.local.
// Creates the collection and an index automatically on first use.
//
// Key differences from db-neon.ts (SQL):
// - MongoDB is a document database — no tables, rows, or schemas; just collections of JSON-like documents
// - Documents use _id (ObjectId) as the primary key — we convert it to a plain string for our Todo interface
// - Queries use filter objects (e.g. { _id }) instead of SQL strings
// - No CREATE TABLE — collections are created automatically on first insert

import { MongoClient, ObjectId } from 'mongodb';
import type { WithId } from 'mongodb';
import type { Todo } from './types';

// Shape of a document in the todos collection (without _id — MongoDB adds that).
type TodoDoc = { title: string; completed: boolean };

const client = new MongoClient(process.env.MONGODB_URI!);

// Connect once when the module first loads, then reuse the connection for every request.
// Typing the collection as Collection<TodoDoc> means all read operations return WithId<TodoDoc>,
// which carries _id: ObjectId alongside the document fields — no type assertions needed.
const getCollection = client.connect().then(() =>
  client.db().collection<TodoDoc>('todos')
);

// MongoDB documents have _id (ObjectId) — map it to the string id our app expects.
function toTodo(doc: WithId<TodoDoc>): Todo {
  return { id: doc._id.toString(), title: doc.title, completed: doc.completed };
}

export const db = {
  async getTodos(): Promise<Todo[]> {
    const col = await getCollection;
    const docs = await col.find({}).toArray();
    return docs.map(toTodo);
  },

  async getTodoById(id: string): Promise<Todo | undefined> {
    const col = await getCollection;
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? toTodo(doc) : undefined;
  },

  async createTodo(title: string): Promise<Todo> {
    const col = await getCollection;
    const result = await col.insertOne({ title, completed: false });
    return { id: result.insertedId.toString(), title, completed: false };
  },

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo> {
    const col = await getCollection;
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    if (!result) throw new Error(`Todo with id ${id} not found`);
    return toTodo(result);
  },

  async deleteTodo(id: string): Promise<void> {
    const col = await getCollection;
    await col.deleteOne({ _id: new ObjectId(id) });
  },
};
