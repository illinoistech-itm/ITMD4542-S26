'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { updateTodo } from '@/app/actions';
import type { Todo } from '@/lib/types';

interface EditTodoFormProps {
  todo: Todo;
}

// EditTodoForm is a Client Component that uses a bound server action.
// .bind() creates a new function that pre-fills the id argument,
// so the form only needs to send the title via FormData.
export default function EditTodoForm({ todo }: EditTodoFormProps) {
  const [isPending, startTransition] = useTransition();
  const updateTodoWithId = updateTodo.bind(null, todo.id);

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await updateTodoWithId(formData);
        });
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Todo Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={todo.title}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
        <Link
          href="/"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
