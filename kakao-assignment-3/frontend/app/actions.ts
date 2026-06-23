"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  fetchTodos,
  fetchTodo,
  postTodo,
  putTodo,
  deleteTodoById,
} from "@/lib/api";
import type { GetTodosParams } from "@/types/todo";

export async function getTodos(params?: GetTodosParams) {
  return fetchTodos(params);
}

export async function getTodo(id: string) {
  return fetchTodo(id);
}

export async function createTodo(formData: FormData) {
  const text = (formData.get("text") as string)?.trim();
  const date = formData.get("date") as string;

  if (!text) throw new Error("할 일 내용을 입력해주세요.");
  if (!date) throw new Error("날짜를 선택해주세요.");

  await postTodo({ text, date });
  revalidatePath("/todos");
  redirect("/todos");
}

export async function updateTodo(id: string, formData: FormData) {
  const text = (formData.get("text") as string)?.trim();
  const date = formData.get("date") as string;
  const completed = formData.get("completed") === "true";

  if (!text) throw new Error("할 일 내용을 입력해주세요.");

  await putTodo(id, { text, date: date || undefined, completed });
  revalidatePath("/todos");
  redirect("/todos");
}

// bind(null, id) 후 form action으로 사용: (formData) => toggleTodo(id, formData)
// hidden input "completed"로 현재 상태를 전달받아 반전시킴
export async function toggleTodo(id: string, formData: FormData) {
  const currentCompleted = formData.get("completed") === "true";
  await putTodo(id, { completed: !currentCompleted });
  revalidatePath("/todos");
}

// bind(null, id) 후 form action으로 사용: (_formData) => deleteTodo(id, _formData)
export async function deleteTodo(id: string, _formData: FormData) {
  await deleteTodoById(id);
  revalidatePath("/todos");
}
