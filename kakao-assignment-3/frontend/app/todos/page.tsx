import Link from "next/link";
import { getTodos } from "@/app/actions";
import { TodoItem } from "@/components/TodoItem";
import { TodoFilter } from "@/components/TodoFilter";
import { TodoSearch } from "@/components/TodoSearch";
import { WeekNavigator } from "@/components/WeekNavigator";
import { todayYMD } from "@/lib/date";
import type { TodoFilter as TodoFilterType } from "@/types/todo";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
    search?: string;
    date?: string;
  }>;
}) {
  const { filter, search, date } = await searchParams;
  const today = todayYMD();

  // 화면 표시용 필터링된 목록 + WeekNavigator용 전체 목록을 병렬로 요청
  const [todos, allTodos] = await Promise.all([
    getTodos({
      filter: filter as TodoFilterType | undefined,
      search,
      date,
    }),
    getTodos(),
  ]);

  const currentFilter = (filter || "all") as TodoFilterType;

  const emptyMessage = search
    ? `"${search}"에 해당하는 할 일이 없습니다.`
    : date
      ? `${date}에 해당하는 할 일이 없습니다.`
      : "할 일이 없습니다. 새 항목을 추가해보세요!";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-purple-600">할 일 목록</h1>
          <Link
            href="/todos/new"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-full transition-colors"
          >
            + 추가
          </Link>
        </div>

        {/* 주간 뷰 */}
        <WeekNavigator
          today={today}
          selectedDate={date}
          allTodos={allTodos}
          currentFilter={filter}
          currentSearch={search}
        />

        {/* 검색 */}
        <div className="mb-3">
          <TodoSearch
            currentSearch={search}
            currentFilter={filter}
            currentDate={date}
          />
        </div>

        {/* 필터 탭 */}
        <div className="mb-4">
          <TodoFilter
            currentFilter={currentFilter}
            currentSearch={search}
            currentDate={date}
          />
        </div>

        {/* Todo 목록 */}
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {todos.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm">{emptyMessage}</p>
            </div>
          ) : (
            todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
          )}
        </div>

        {todos.length > 0 && (
          <p className="text-xs text-gray-400 text-right mt-3">
            {todos.filter((t) => !t.completed).length}개 남음 / 총{" "}
            {todos.length}개
          </p>
        )}
      </div>
    </div>
  );
}
