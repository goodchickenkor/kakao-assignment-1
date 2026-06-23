import Link from "next/link";
import { toggleTodo, deleteTodo } from "@/app/actions";
import type { Todo } from "@/types/todo";

export function TodoItem({ todo }: { todo: Todo }) {
  const boundToggle = toggleTodo.bind(null, todo.id);
  const boundDelete = deleteTodo.bind(null, todo.id);

  return (
    <div
      className={`flex items-start gap-3 px-5 py-4 ${
        todo.completed ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium text-gray-800 break-words ${
            todo.completed ? "line-through" : ""
          }`}
        >
          {todo.text}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{todo.date}</p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <form action={boundToggle}>
          <input type="hidden" name="completed" value={String(todo.completed)} />
          <button
            type="submit"
            className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
              todo.completed
                ? "bg-gray-100 hover:bg-gray-200 text-gray-600"
                : "bg-green-100 hover:bg-green-200 text-green-700"
            }`}
          >
            {todo.completed ? "취소" : "완료"}
          </button>
        </form>

        <Link
          href={`/todos/${todo.id}`}
          className="text-xs font-medium px-2.5 py-1 rounded-md bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
        >
          수정
        </Link>

        <form action={boundDelete}>
          <button
            type="submit"
            className="text-xs font-medium px-2.5 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
          >
            삭제
          </button>
        </form>
      </div>
    </div>
  );
}
