# Next.js Todos — MongoDB Reference (Student Handout)

This demo adds two new database adapters to the todos app you already know. The app itself — pages, components, server actions — is unchanged. Only the database layer is extended.

---

## What We Added

```text
lib/
├── db-mongo.ts      ← new: MongoDB native driver
└── db-mongoose.ts   ← new: Mongoose ODM
```

To switch between them, change one line in `lib/db.ts`:

```typescript
// ↓ Swap this import to change the database implementation
// export { db } from './db-json';
// export { db } from './db-sqlite';
// export { db } from './db-neon';
export { db } from './db-mongo';
// export { db } from './db-mongoose';
```

---

## MongoDB vs. SQL — The Key Difference

MongoDB is a **document database**. Instead of tables and rows, it stores **collections of JSON-like documents**.

| SQL (Neon/SQLite) | MongoDB |
|---|---|
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary key (`id UUID`) | `_id` (ObjectId) |
| `SELECT * FROM todos` | `col.find({})` |
| `WHERE id = $1` | `{ _id: new ObjectId(id) }` |
| `UPDATE ... SET title = $1` | `{ $set: { title } }` |

---

## Environment Variable

Add `MONGODB_URI` to your `.env.local`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>?appName=<app>
```

> `.env.local` is git-ignored. Never commit your connection string.

---

## `lib/db-mongo.ts` — Native Driver

```typescript
import { MongoClient, ObjectId } from 'mongodb';
import type { WithId } from 'mongodb';
import type { Todo } from './types';

// Shape of a document in the todos collection (without _id — MongoDB adds that).
type TodoDoc = { title: string; completed: boolean };

const client = new MongoClient(process.env.MONGODB_URI!);

// collection<TodoDoc> types all read operations as WithId<TodoDoc> = { _id: ObjectId } & TodoDoc.
const getCollection = client.connect().then(() =>
  client.db().collection<TodoDoc>('todos')
);

// _id is an ObjectId — convert it to a plain string for our Todo interface.
function toTodo(doc: WithId<TodoDoc>): Todo {
  return { id: doc._id.toString(), title: doc.title, completed: doc.completed };
}
```

Key methods:

| What | Code |
|---|---|
| Find all | `col.find({}).toArray()` |
| Find one | `col.findOne({ _id: new ObjectId(id) })` |
| Insert | `col.insertOne({ title, completed: false })` |
| Update | `col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: 'after' })` |
| Delete | `col.deleteOne({ _id: new ObjectId(id) })` |

**Why `new ObjectId(id)`?**
MongoDB stores `_id` as an `ObjectId` (binary), not a plain string. When querying by id, you must convert your string back to an `ObjectId` so MongoDB can match it. When reading, `.toString()` converts it back to a string for our app.

**Why `{ $set: updates }`?**
Without `$set`, passing `{ completed: true }` to an update would *replace the entire document* with just `{ completed: true }` — deleting the `title`. `$set` patches only the specified fields.

---

## `lib/db-mongoose.ts` — Mongoose ODM

```typescript
import mongoose, { Schema, model, models, Types } from 'mongoose';
import type { Todo } from './types';

const ready = mongoose.connect(process.env.MONGODB_URI!, { dbName: 'todos_mongoose' });

interface TodoDoc {
  title: string;
  completed: boolean;
}

const TodoSchema = new Schema<TodoDoc>({
  title:     { type: String,  required: true },
  completed: { type: Boolean, default: false },
});

// Guard against hot-reload re-registering the same model.
const TodoModel = (models.Todo || model<TodoDoc>('Todo', TodoSchema)) as mongoose.Model<TodoDoc>;

function toTodo(doc: TodoDoc & { _id: Types.ObjectId }): Todo {
  return { id: doc._id.toString(), title: doc.title, completed: doc.completed };
}
```

Key methods:

| What | Code |
|---|---|
| Find all | `TodoModel.find({}).lean()` |
| Find one | `TodoModel.findById(id).lean()` |
| Insert | `TodoModel.create({ title })` |
| Update | `TodoModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean()` |
| Delete | `TodoModel.findByIdAndDelete(id)` |

**What `.lean()` does:**
By default, Mongoose returns full Document objects with built-in methods (`.save()`, `.toObject()`, etc.). `.lean()` skips all that and returns a plain JavaScript object — faster and all we need for reading.

**Why `models.Todo || model(...)`:**
Next.js reloads modules during development. If `model('Todo', ...)` runs twice, Mongoose throws `OverwriteModelError`. The `models.Todo` check reuses the already-registered model if it exists.

**`findById(id)` vs `findOne({ _id: new ObjectId(id) })`:**
Mongoose knows `_id` is an ObjectId and handles the conversion automatically. The native driver doesn't — you write it yourself.

---

## Native Driver vs. Mongoose

| | Native Driver | Mongoose |
|---|---|---|
| Schema enforcement | None — any document structure accepted | Schema defined in code; violations throw `ValidationError` |
| TypeScript types | `collection<TodoDoc>()` generic + `WithId<T>` | Generated from schema |
| Query API | Filter objects, `$set`, `$push` etc. | `.find()`, `.findById()`, chainable |
| `.lean()` needed? | N/A (returns plain objects) | Yes, for read-only queries |
| ObjectId conversion | Manual (`new ObjectId(id)`) | Automatic (`findById`) |
| When to use | Full control, performance-critical | Most application code |

---

## The `_id` to `id` Pattern

This same pattern appears in both adapters:

```typescript
// Reading from MongoDB:
doc._id.toString()  // ObjectId("507f...") → "507f..."

// Querying MongoDB:
new ObjectId(id)    // "507f..." → ObjectId("507f...")
```

Our `Todo` interface uses `id: string` throughout. The adapter layer handles the translation. Pages, components, and actions never see `_id` or `ObjectId` — they just use the string `id` from the URL or the Todo object.

---

## `next.config.ts`

```typescript
serverExternalPackages: ['better-sqlite3', 'mongodb', 'mongoose'],
```

Database drivers are added here to ensure they run in the Node.js runtime and aren't bundled by Webpack/Turbopack.

---

## All Available Adapters

| File | Database | Type | Notes |
|---|---|---|---|
| `db-json.ts` | `data/todos.json` | File | No setup needed |
| `db-sqlite.ts` | `data/todos.db` | Embedded SQL | Local file, synchronous |
| `db-neon.ts` | Neon Postgres | Cloud SQL | `NEON_DB_CONNECTION` in `.env.local` |
| `db-mongo.ts` | MongoDB Atlas | Cloud document | `MONGODB_URI` in `.env.local` |
| `db-mongoose.ts` | MongoDB Atlas | Cloud document + schema | Same URI, adds Mongoose schema |

All five implement the same `Database` interface in `lib/db.ts`. Swapping between them requires changing exactly one line.
