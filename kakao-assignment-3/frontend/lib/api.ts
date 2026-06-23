import axios, { AxiosError } from "axios";
import type { Todo, GetTodosParams } from "@/types/todo";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const client = axios.create({ baseURL: BACKEND_URL });

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function toApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail;
    const message = typeof detail === "string" ? detail : error.message;
    throw new ApiError(message, error.response?.status);
  }
  throw error;
}

export async function fetchTodos(params?: GetTodosParams): Promise<Todo[]> {
  try {
    const res = await client.get<Todo[]>("/todos", {
      params: {
        ...(params?.filter && params.filter !== "all" && { filter: params.filter }),
        ...(params?.search && { search: params.search }),
        ...(params?.date && { date: params.date }),
      },
    });
    return res.data;
  } catch (error) {
    toApiError(error);
  }
}

export async function fetchTodo(id: string): Promise<Todo> {
  try {
    const res = await client.get<Todo>(`/todos/${id}`);
    return res.data;
  } catch (error) {
    toApiError(error);
  }
}

export async function postTodo(payload: {
  text: string;
  date: string;
}): Promise<Todo> {
  try {
    const res = await client.post<Todo>("/todos", payload);
    return res.data;
  } catch (error) {
    toApiError(error);
  }
}

export async function putTodo(
  id: string,
  payload: { text?: string; completed?: boolean; date?: string }
): Promise<Todo> {
  try {
    const res = await client.put<Todo>(`/todos/${id}`, payload);
    return res.data;
  } catch (error) {
    toApiError(error);
  }
}

export async function deleteTodoById(id: string): Promise<void> {
  try {
    await client.delete(`/todos/${id}`);
  } catch (error) {
    toApiError(error);
  }
}
