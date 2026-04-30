import { db } from '@/lib/db';
import { auth } from '@/auth';
import TodoItem from '@/components/TodoItem';

// Server Component — reads completed todos straight from the database.
export default async function CompletedPage() {
  const session = await auth();
  const todos = await db.getTodos(session!.user!.id!);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Completed Todos
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({completedTodos.length} completed)
        </span>
      </h2>

      {completedTodos.length === 0 ? (
        <p className="text-center text-gray-400 py-12">
          No completed todos yet. Go finish something!
        </p>
      ) : (
        <ul className="space-y-2">
          {completedTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
}
