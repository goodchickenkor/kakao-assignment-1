import type { NextRequest } from "next/server";
import axios, { AxiosError } from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

type Params = Promise<{ todoId: string }>;

function backendError(error: unknown, fallback: string) {
  const message =
    error instanceof AxiosError ? error.message : fallback;
  const status =
    error instanceof AxiosError && error.response?.status === 404 ? 404 : 502;
  return Response.json({ error: message }, { status });
}

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { todoId } = await params;
  try {
    const res = await axios.get(`${BACKEND_URL}/todos/${todoId}`);
    return Response.json(res.data);
  } catch (error) {
    return backendError(error, "Failed to fetch todo");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  const { todoId } = await params;
  try {
    const body = await req.json();
    const res = await axios.put(`${BACKEND_URL}/todos/${todoId}`, body);
    return Response.json(res.data);
  } catch (error) {
    return backendError(error, "Failed to update todo");
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Params }
) {
  const { todoId } = await params;
  try {
    await axios.delete(`${BACKEND_URL}/todos/${todoId}`);
    return new Response(null, { status: 204 });
  } catch (error) {
    return backendError(error, "Failed to delete todo");
  }
}
