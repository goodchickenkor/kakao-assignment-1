"use client";

import { useRouter } from "next/navigation";
import type { TodoFilter } from "@/types/todo";

const LABELS: Record<TodoFilter, string> = {
  all: "전체",
  active: "진행 중",
  completed: "완료",
};

type Props = {
  currentFilter: TodoFilter;
  currentSearch?: string;
  currentDate?: string;
};

export function TodoFilter({ currentFilter, currentSearch, currentDate }: Props) {
  const router = useRouter();

  function navigate(filter: TodoFilter) {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (currentSearch) params.set("search", currentSearch);
    if (currentDate) params.set("date", currentDate);
    const qs = params.toString();
    router.push(qs ? `/todos?${qs}` : "/todos");
  }

  return (
    <div className="flex gap-2">
      {(["all", "active", "completed"] as TodoFilter[]).map((f) => (
        <button
          key={f}
          onClick={() => navigate(f)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            currentFilter === f
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-purple-50 border border-gray-200"
          }`}
        >
          {LABELS[f]}
        </button>
      ))}
    </div>
  );
}
