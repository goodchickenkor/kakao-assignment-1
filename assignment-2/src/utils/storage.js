// localStorage에서 읽은 JSON 문자열을 안전하게 파싱한다.
// 값이 없거나 파싱에 실패하면 fallback을 반환한다.
export function safeParseJSON(value, fallback) {
  try {
    return value !== null && value !== undefined
      ? JSON.parse(value)
      : fallback;
  } catch {
    return fallback;
  }
}
