import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import EditTodoForm from '@/components/EditTodoForm';

// In Next.js 15+, params is a Promise — we must await it.
export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // id is already a string — no Number() conversion needed with string IDs
  const { id } = await params;
  const todo = await db.getTodoById(id);

  // notFound() renders the nearest not-found.tsx (or Next.js default 404)
  if (!todo) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to todos
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Edit Todo</h2>
        <p className="text-sm text-gray-500 mb-6">
          Status:{' '}
          <span className={todo.completed ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
            {todo.completed ? 'Completed' : 'Active'}
          </span>
        </p>

        <EditTodoForm todo={todo} />
      </div>
    </div>
  );
}
