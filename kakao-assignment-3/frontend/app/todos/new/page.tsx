import { createTodo } from "@/app/actions";
import { TodoForm } from "@/components/TodoForm";
import { todayYMD } from "@/lib/date";

export default function NewTodoPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-purple-600 mb-6">새 할 일</h1>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <TodoForm
            action={createTodo}
            defaultValues={{ date: todayYMD() }}
            submitLabel="추가"
          />
        </div>
      </div>
    </div>
  );
}
