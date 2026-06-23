import type { NextRequest } from "next/server";
import axios, { AxiosError } from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const params: Record<string, string> = {};
  const filter = searchParams.get("filter");
  const search = searchParams.get("search");
  const date = searchParams.get("date");
  if (filter) params.filter = filter;
  if (search) params.search = search;
  if (date) params.date = date;

  try {
    const res = await axios.get(`${BACKEND_URL}/todos`, { params });
    return Response.json(res.data);
  } catch (error) {
    const message =
      error instanceof AxiosError ? error.message : "Failed to fetch todos";
    return Response.json({ error: message }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await axios.post(`${BACKEND_URL}/todos`, body);
    return Response.json(res.data, { status: 201 });
  } catch (error) {
    const message =
      error instanceof AxiosError ? error.message : "Failed to create todo";
    return Response.json({ error: message }, { status: 502 });
  }
}
