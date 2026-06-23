"use client";

import Link from "next/link";

type TodoFormProps = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    text?: string;
    date?: string;
    completed?: boolean;
  };
  submitLabel: string;
  isEdit?: boolean;
};

export function TodoForm({
  action,
  defaultValues,
  submitLabel,
  isEdit = false,
}: TodoFormProps) {
  // 한국어 IME 조합 중 Enter로 폼이 중복 제출되는 것을 방지
  function handleTextKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && (e.nativeEvent.isComposing || e.keyCode === 229)) {
      e.preventDefault();
    }
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          할 일
        </label>
        <input
          id="text"
          name="text"
          type="text"
          defaultValue={defaultValues?.text ?? ""}
          required
          autoFocus
          onKeyDown={handleTextKeyDown}
          placeholder="할 일을 입력하세요"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          날짜
        </label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={defaultValues?.date ?? ""}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
      </div>

      {isEdit && (
        <div className="flex items-center gap-2">
          <input
            id="completed"
            name="completed"
            type="checkbox"
            value="true"
            defaultChecked={defaultValues?.completed ?? false}
            className="w-4 h-4 accent-purple-600"
          />
          <label htmlFor="completed" className="text-sm text-gray-700">
            완료됨
          </label>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          {submitLabel}
        </button>
        <Link
          href="/todos"
          className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
