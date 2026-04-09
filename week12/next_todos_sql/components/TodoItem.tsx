'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { toggleTodo, deleteTodo } from '@/app/actions';
import type { Todo } from '@/lib/types';

interface TodoItemProps {
  todo: Todo;
}

// TodoItem is a Client Component because it has interactive elements
// (checkbox and delete button) that call server actions on click.
export default function TodoItem({ todo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleTodo(todo.id);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTodo(todo.id);
    });
  }

  return (
    <li className={`flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm border border-gray-100 ${isPending ? 'opacity-60' : ''}`}>
      {/* Checkbox toggles completion */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isPending}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
      />

      {/* Title links to the detail/edit page */}
      <Link
        href={`/todo/${todo.id}`}
        className={`flex-1 text-sm hover:text-blue-600 transition-colors ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
      >
        {todo.title}
      </Link>

      {/* Delete button — only shown for completed todos */}
      {todo.completed && (
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
        >
          Delete
        </button>
      )}
    </li>
  );
}
