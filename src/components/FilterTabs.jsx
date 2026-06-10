const FILTERS = [
  { key: "all", label: "전체" },
  { key: "active", label: "진행 중" },
  { key: "completed", label: "완료" },
];

export default function FilterTabs({ currentFilter, onChangeFilter }) {
  return (
    <section className="mb-5 flex gap-1.5 rounded-[10px] border border-[#e0e0e0] bg-white p-[5px]">
      {FILTERS.map(({ key, label }) => {
        const isActive = currentFilter === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChangeFilter(key)}
            className={`flex-1 rounded-[7px] py-[9px] text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#672be0] text-white"
                : "text-[#888] hover:bg-[#ede5fb] hover:text-[#672be0]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </section>
  );
}
