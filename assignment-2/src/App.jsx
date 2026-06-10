import { useState } from "react";
import { getTodayStr, dateStrToDate, toDateStr } from "./utils/date.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import WeekNavigator from "./components/WeekNavigator.jsx";
import TodoInput from "./components/TodoInput.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import TodoList from "./components/TodoList.jsx";

// ===== 로컬스토리지 키 상수 (기존 코드와 동일) =====
const STORAGE_KEY_TODOS = "todos";
const STORAGE_KEY_NEXTID = "nextId";

export default function App() {
  // todos: 배열인지 검증해 깨진 데이터 시 빈 배열로 복구
  const [todos, setTodos] = useLocalStorage(STORAGE_KEY_TODOS, [], Array.isArray);
  // nextId: 유한 숫자인지 검증해 깨진 데이터 시 1로 복구
  const [nextId, setNextId] = useLocalStorage(
    STORAGE_KEY_NEXTID,
    1,
    (v) => typeof v === "number" && Number.isFinite(v)
  );
  // currentFilter: 'all' | 'active' | 'completed'
  const [currentFilter, setCurrentFilter] = useState("all");
  // selectedDate: 현재 선택된 날짜 (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(() => getTodayStr());

  const todayStr = getTodayStr();

  // ===== Todo CRUD =====
  function addTodo(text) {
    setTodos((prev) => [
      ...prev,
      { id: nextId, text, completed: false, date: selectedDate },
    ]);
    setNextId((prev) => prev + 1);
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function toggleComplete(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function updateTodoText(id, newText) {
    const text = newText.trim();
    if (!text) return;
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  }

  // ===== 날짜 이동 =====
  function moveDate(offset) {
    const date = dateStrToDate(selectedDate);
    date.setDate(date.getDate() + offset);
    setSelectedDate(toDateStr(date));
  }

  function goToToday() {
    setSelectedDate(todayStr);
  }

  // ===== 필터링된 Todo 계산 =====
  const todosForDate = todos.filter((todo) => todo.date === selectedDate);
  const filteredTodos = todosForDate.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-[560px]">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#672be0]">
            My Todo
          </h1>
        </header>

        <WeekNavigator
          selectedDate={selectedDate}
          todayStr={todayStr}
          todos={todos}
          onSelectDate={setSelectedDate}
          onPrevWeek={() => moveDate(-7)}
          onNextWeek={() => moveDate(7)}
          onToday={goToToday}
        />

        <TodoInput onAdd={addTodo} />

        <FilterTabs
          currentFilter={currentFilter}
          onChangeFilter={setCurrentFilter}
        />

        <TodoList
          todos={filteredTodos}
          currentFilter={currentFilter}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
          onUpdate={updateTodoText}
        />
      </div>
    </div>
  );
}
