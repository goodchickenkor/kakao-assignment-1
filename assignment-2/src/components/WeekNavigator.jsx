import { getWeekDates, formatWeekRange, dateStrToDate } from "../utils/date.js";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeekNavigator({
  selectedDate,
  todayStr,
  todos = [],
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onToday,
}) {
  const weekDates = getWeekDates(selectedDate);
  const rangeLabel = formatWeekRange(weekDates[0], weekDates[6]);

  return (
    <section className="mb-5 overflow-hidden rounded-[10px] border border-[#e0e0e0] bg-white">
      {/* 주간 헤더 */}
      <div className="flex items-center justify-between border-b border-[#e0e0e0] px-4 py-3">
        <button
          type="button"
          onClick={onPrevWeek}
          aria-label="이전 주"
          className="rounded-md px-2 text-3xl leading-none text-[#672be0] transition-colors hover:bg-[#ede5fb]"
        >
          &#8249;
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-base font-semibold tracking-tight text-[#1a1a2e]">
            {rangeLabel}
          </span>
          {selectedDate !== todayStr && (
            <button
              type="button"
              onClick={onToday}
              className="rounded-full border-[1.5px] border-[#672be0] px-2.5 py-[3px] text-xs font-semibold text-[#672be0] transition-colors hover:bg-[#672be0] hover:text-white"
            >
              오늘
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onNextWeek}
          aria-label="다음 주"
          className="rounded-md px-2 text-3xl leading-none text-[#672be0] transition-colors hover:bg-[#ede5fb]"
        >
          &#8250;
        </button>
      </div>

      {/* 요일 셀 그리드 */}
      <div className="grid grid-cols-7">
        {weekDates.map((dateStr) => {
          const count = todos.filter((t) => t.date === dateStr).length;
          const dateObj = dateStrToDate(dateStr);
          const dow = dateObj.getDay();
          const d = dateObj.getDate();
          const m = dateObj.getMonth() + 1;

          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const isSaturday = dow === 6;
          const isSunday = dow === 0;

          // 요일 이름 색상
          let nameColor = "text-[#888]";
          if (isSaturday) nameColor = "text-[#4a90d9]";
          if (isSunday) nameColor = "text-[#e05252]";

          // 날짜 숫자 원형 스타일
          let numClass = "text-[#1a1a2e]";
          if (isSaturday && !isSelected) numClass = "text-[#4a90d9]";
          if (isSunday && !isSelected) numClass = "text-[#e05252]";
          if (isToday && !isSelected) numClass = "bg-[#ede5fb] text-[#672be0]";
          if (isSelected) numClass = "bg-[#672be0] text-white";

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              aria-label={`${m}월 ${d}일 할 일 ${count}개`}
              className="flex flex-col items-center gap-1 border-r border-[#e0e0e0] px-1 pb-2 pt-2.5 transition-colors last:border-r-0 hover:bg-[#ede5fb]"
            >
              <span className={`text-[0.72rem] font-medium ${nameColor}`}>
                {DAY_NAMES[dow]}
              </span>
              <span
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full text-[0.95rem] font-semibold transition-colors ${numClass}`}
              >
                {d}
              </span>
              <span className="min-h-3 text-[0.68rem] font-bold leading-none text-[#672be0]">
                {count > 0 ? count : ""}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
