'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function requireAuth(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export async function addTodo(formData: FormData) {
  const userId = await requireAuth();
  const title = formData.get('title') as string;
  if (!title?.trim()) return;

  await db.createTodo(title.trim(), userId);
  revalidatePath('/');
  redirect('/');
}

export async function toggleTodo(id: string) {
  await requireAuth();
  const todo = await db.getTodoById(id);
  if (!todo) return;

  await db.updateTodo(id, { completed: !todo.completed });
  revalidatePath('/');
  revalidatePath('/completed');
}

export async function deleteTodo(id: string) {
  await requireAuth();
  await db.deleteTodo(id);
  revalidatePath('/completed');
}

export async function updateTodo(id: string, formData: FormData) {
  await requireAuth();
  const title = formData.get('title') as string;
  if (!title?.trim()) return;

  await db.updateTodo(id, { title: title.trim() });
  revalidatePath('/');
  revalidatePath('/completed');
  redirect('/');
}
