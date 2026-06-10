import { useState, useRef, useEffect } from "react";

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  // 수정 모드 진입 시 입력창에 focus하고 커서를 맨 뒤로 이동
  useEffect(() => {
    if (isEditing && inputRef.current) {
      const input = inputRef.current;
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }, [isEditing]);

  function enterEditMode() {
    setEditText(todo.text);
    setIsEditing(true);
  }

  function saveEdit() {
    const trimmed = editText.trim();
    // 빈 문자열이면 저장하지 않고 입력창에 focus 유지
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    onUpdate(todo.id, trimmed);
    setIsEditing(false);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditText(todo.text);
  }

  function handleKeyDown(e) {
    // IME 조합 중 Enter로 조합을 확정할 때 중복 저장 방지
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-[10px] border border-[#e0e0e0] bg-white px-4 py-3.5 transition-shadow hover:shadow-[0_2px_10px_rgba(103,43,224,0.1)] ${
        todo.completed ? "border-l-4 border-l-[#27ae60] opacity-70" : ""
      }`}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          maxLength={100}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-md border-2 border-[#672be0] px-2.5 py-1.5 text-base text-[#1a1a2e] outline-none"
        />
      ) : (
        <span
          className={`flex-1 break-all text-base leading-normal ${
            todo.completed ? "text-[#888] line-through" : ""
          }`}
        >
          {todo.text}
        </span>
      )}

      <div className="flex flex-shrink-0 gap-1.5">
        {isEditing ? (
          <button
            type="button"
            onClick={saveEdit}
            className="rounded-[10px] bg-[#672be0] px-3 py-[7px] text-xs font-semibold text-white transition-colors hover:bg-[#4e1eaa]"
          >
            저장
          </button>
        ) : (
          <button
            type="button"
            onClick={enterEditMode}
            className="rounded-[10px] bg-[#ede5fb] px-3 py-[7px] text-xs font-semibold text-[#672be0] transition-colors hover:bg-[#d9c8f7]"
          >
            수정
          </button>
        )}

        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className="rounded-[10px] bg-[#e8f8ef] px-3 py-[7px] text-xs font-semibold text-[#27ae60] transition-colors hover:bg-[#c9edd8]"
        >
          {todo.completed ? "취소" : "완료"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="rounded-[10px] bg-[#fdeaea] px-3 py-[7px] text-xs font-semibold text-[#e05252] transition-colors hover:bg-[#f5c6c6]"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
