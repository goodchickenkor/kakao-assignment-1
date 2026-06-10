import { useState, useEffect } from "react";
import { safeParseJSON } from "../utils/storage.js";

// localStorage와 동기화되는 state 훅.
// validate(parsedValue) 함수를 넘기면, 파싱 결과가 검증을 통과하지 못할 때
// initialValue를 대신 사용해 앱이 중단되지 않도록 보호한다.
export function useLocalStorage(key, initialValue, validate) {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key);
    const parsed = safeParseJSON(raw, initialValue);
    if (validate && !validate(parsed)) {
      return initialValue;
    }
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
