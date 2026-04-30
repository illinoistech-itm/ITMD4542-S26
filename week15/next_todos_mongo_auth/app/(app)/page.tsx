import { db } from '@/lib/db';
import { auth } from '@/auth';
import TodoItem from '@/components/TodoItem';

// This is a Server Component — it fetches data directly and renders HTML on the server.
// No useState, no useEffect, no loading spinners — the data is ready when the page renders.
export default async function HomePage() {
  const session = await auth();
  const todos = await db.getTodos(session!.user!.id!);
  const activeTodos = todos.filter(t => !t.completed);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Active Todos
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({activeTodos.length} remaining)
        </span>
      </h2>

      {activeTodos.length === 0 ? (
        <p className="text-center text-gray-400 py-12">
          All done! Add a new todo above.
        </p>
      ) : (
        <ul className="space-y-2">
          {activeTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
}
