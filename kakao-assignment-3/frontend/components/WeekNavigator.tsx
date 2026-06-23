"use client";

import { useRouter } from "next/navigation";
import { getWeekDates, toYMD } from "@/lib/date";
import type { Todo } from "@/types/todo";

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

type Props = {
  today: string;
  selectedDate?: string;
  allTodos: Todo[];
  currentFilter?: string;
  currentSearch?: string;
};

export function WeekNavigator({
  today,
  selectedDate,
  allTodos,
  currentFilter,
  currentSearch,
}: Props) {
  const router = useRouter();

  const reference = selectedDate || today;
  const weekDates = getWeekDates(reference);
  const monday = weekDates[0];
  const headerLabel = `${monday.getFullYear()}년 ${monday.getMonth() + 1}월`;

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    if (currentFilter && currentFilter !== "all")
      params.set("filter", currentFilter);
    if (currentSearch) params.set("search", currentSearch);
    if (overrides.date) params.set("date", overrides.date);
    const qs = params.toString();
    return qs ? `/todos?${qs}` : "/todos";
  }

  function navigateWeek(direction: -1 | 1) {
    const target = new Date(monday);
    target.setDate(monday.getDate() + direction * 7);
    router.push(buildUrl({ date: toYMD(target) }));
  }

  function selectDay(dateStr: string) {
    // 같은 날 재클릭 시 날짜 필터 해제
    router.push(
      dateStr === selectedDate
        ? buildUrl({ date: undefined })
        : buildUrl({ date: dateStr })
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-3 mb-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => navigateWeek(-1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="이전 주"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-700">{headerLabel}</span>
        <button
          onClick={() => navigateWeek(1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="다음 주"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, i) => {
          const dateStr = toYMD(date);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const isSat = i === 5;
          const isSun = i === 6;
          const count = allTodos.filter((t) => t.date === dateStr).length;

          const textColor = isSelected
            ? "text-white"
            : isSat
              ? "text-blue-500"
              : isSun
                ? "text-red-500"
                : "text-gray-700";

          const dayNameColor = isSelected
            ? "text-purple-100"
            : isSat
              ? "text-blue-400"
              : isSun
                ? "text-red-400"
                : "text-gray-400";

          return (
            <button
              key={dateStr}
              onClick={() => selectDay(dateStr)}
              className={`flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-colors ${
                isSelected
                  ? "bg-purple-600"
                  : isToday
                    ? "ring-2 ring-purple-400 bg-purple-50"
                    : "hover:bg-gray-50"
              }`}
            >
              <span className={`text-[10px] font-medium ${dayNameColor}`}>
                {DAY_NAMES[i]}
              </span>
              <span className={`text-sm font-bold mt-0.5 ${textColor}`}>
                {date.getDate()}
              </span>
              <span
                className={`text-[10px] mt-0.5 ${
                  isSelected ? "text-purple-200" : "text-gray-400"
                }`}
              >
                {count > 0 ? `${count}개` : "·"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
