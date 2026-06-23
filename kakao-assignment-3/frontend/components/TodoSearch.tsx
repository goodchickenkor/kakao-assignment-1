"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type Props = {
  currentSearch?: string;
  currentFilter?: string;
  currentDate?: string;
};

export function TodoSearch({ currentSearch, currentFilter, currentDate }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(currentSearch ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // URL이 외부에서 바뀌면 (필터 클릭 등) 입력값 동기화
  useEffect(() => {
    setValue(currentSearch ?? "");
  }, [currentSearch]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function navigate(search: string) {
    const params = new URLSearchParams();
    if (currentFilter && currentFilter !== "all")
      params.set("filter", currentFilter);
    if (search.trim()) params.set("search", search.trim());
    if (currentDate) params.set("date", currentDate);
    const qs = params.toString();
    router.push(qs ? `/todos?${qs}` : "/todos");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => navigate(v), 300);
  }

  // IME 조합 중 Enter 방어 + 즉시 검색
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") {
      if (timerRef.current) clearTimeout(timerRef.current);
      navigate(value);
    }
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="할 일 검색..."
        className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            navigate("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          aria-label="검색어 지우기"
        >
          ✕
        </button>
      )}
    </div>
  );
}
