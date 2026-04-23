'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Add a new todo and redirect to the home page
export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string;
  if (!title?.trim()) return;

  await db.createTodo(title.trim());
  revalidatePath('/');
  redirect('/');
}

// Toggle a todo between complete and incomplete
export async function toggleTodo(id: string) {
  const todo = await db.getTodoById(id);
  if (!todo) return;

  await db.updateTodo(id, { completed: !todo.completed });
  revalidatePath('/');
  revalidatePath('/completed');
}

// Delete a todo (only completed todos can be deleted)
export async function deleteTodo(id: string) {
  await db.deleteTodo(id);
  revalidatePath('/completed');
}

// Update a todo's title and redirect home
export async function updateTodo(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  if (!title?.trim()) return;

  await db.updateTodo(id, { title: title.trim() });
  revalidatePath('/');
  revalidatePath('/completed');
  redirect('/');
}
