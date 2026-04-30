'use client';

import { useRef, useTransition } from 'react';
import { addTodo } from '@/app/actions';

// AddTodoForm is a Client Component so it can manage the input state
// and show a pending indicator while the server action runs.
export default function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addTodo(formData);
      // redirect() in addTodo navigates away, so reset is a safety net
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2">
      <input
        name="title"
        type="text"
        required
        placeholder="Add a new todo..."
        className="flex-1 rounded-md border border-white/40 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:border-white/80 focus:outline-none focus:ring-1 focus:ring-white/20"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-white disabled:opacity-60 transition-colors"
      >
        {isPending ? 'Adding…' : 'Add Todo'}
      </button>
    </form>
  );
}
