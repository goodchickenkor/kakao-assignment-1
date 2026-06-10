import { useState } from "react";

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) {
      setShowWarning(true);
      return;
    }
    onAdd(trimmed);
    setText("");
    setShowWarning(false);
  }

  function handleKeyDown(e) {
    // IME 조합 중(한국어 등) Enter로 조합을 확정할 때 중복 추가 방지
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") handleAdd();
  }

  function handleChange(e) {
    setText(e.target.value);
    if (showWarning) setShowWarning(false);
  }

  return (
    <section className="mb-5">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
          maxLength={100}
          className="flex-1 rounded-[10px] border-2 border-[#e0e0e0] bg-white px-4 py-3 text-base text-[#1a1a2e] outline-none transition-colors focus:border-[#672be0]"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="whitespace-nowrap rounded-[10px] bg-[#672be0] px-[18px] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4e1eaa]"
        >
          추가
        </button>
      </div>
      {showWarning && (
        <p className="mt-2 pl-1 text-sm text-[#e05252]">할 일을 입력해주세요.</p>
      )}
    </section>
  );
}
