import TodoItem from "./TodoItem.jsx";

function getEmptyMessage(filter) {
  if (filter === "active") return "진행 중인 할 일이 없습니다.";
  if (filter === "completed") return "완료된 할 일이 없습니다.";
  return "이 날의 할 일이 없습니다.";
}

export default function TodoList({
  todos = [],
  currentFilter,
  onToggle,
  onDelete,
  onUpdate,
}) {
  if (todos.length === 0) {
    return (
      <section>
        <p className="py-10 text-center text-[0.95rem] text-[#888]">
          {getEmptyMessage(currentFilter)}
        </p>
      </section>
    );
  }

  return (
    <section>
      <ul className="flex flex-col gap-2.5">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </ul>
    </section>
  );
}
