// ===== 날짜 유틸 함수 =====
// 기존 Vanilla JS 코드의 날짜 계산 방식과 동일하게 동작한다.

// 오늘 날짜를 "YYYY-MM-DD" 문자열로 반환
export function getTodayStr() {
  return toDateStr(new Date());
}

// Date 객체를 "YYYY-MM-DD" 문자열로 변환
export function toDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// "YYYY-MM-DD" 문자열을 Date 객체로 변환
export function dateStrToDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// 해당 날짜가 속한 주의 월요일 Date 객체 반환
export function getMondayOfWeek(dateStr) {
  const date = dateStrToDate(dateStr);
  const dow = date.getDay(); // 0=일, 1=월, ..., 6=토
  const diff = dow === 0 ? -6 : 1 - dow;
  date.setDate(date.getDate() + diff);
  return date;
}

// 해당 날짜가 속한 주의 월~일 7개 날짜 문자열 배열 반환
export function getWeekDates(dateStr) {
  const monday = getMondayOfWeek(dateStr);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(toDateStr(d));
  }
  return dates;
}

// 주간 범위를 사람이 읽기 좋은 라벨로 포맷
export function formatWeekRange(startStr, endStr) {
  const [sy, sm, sd] = startStr.split("-").map(Number);
  const [, em, ed] = endStr.split("-").map(Number);
  if (sm === em) {
    return `${sy}년 ${sm}월 ${sd}일 - ${ed}일`;
  }
  return `${sy}년 ${sm}월 ${sd}일 - ${em}월 ${ed}일`;
}
