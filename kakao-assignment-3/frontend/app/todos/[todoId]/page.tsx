import { notFound } from "next/navigation";
import { getTodo, updateTodo } from "@/app/actions";
import { TodoForm } from "@/components/TodoForm";
import { ApiError } from "@/lib/api";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;

  let todo;
  try {
    todo = await getTodo(todoId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const updateWithId = updateTodo.bind(null, todoId);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-purple-600 mb-6">할 일 수정</h1>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <TodoForm
            action={updateWithId}
            defaultValues={{
              text: todo.text,
              date: todo.date,
              completed: todo.completed,
            }}
            submitLabel="저장"
            isEdit
          />
        </div>
      </div>
    </div>
  );
}
