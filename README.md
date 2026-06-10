# Todo App (React)

Vanilla JS로 구현된 Todo 앱을 React Function Component 구조로 마이그레이션한 프로젝트입니다.

---

## 기술 스택

| 항목 | 버전 |
|---|---|
| React | 18.x |
| Vite | 5.x |
| Tailwind CSS | 4.x (`@tailwindcss/vite` 플러그인 방식) |
| 언어 | JavaScript (TypeScript 미사용) |
| 스토리지 | Web Storage API (localStorage) |

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 프로젝트 구조

```
assignment-2/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx              # React 진입점 (createRoot)
    ├── index.css             # @import "tailwindcss" + 최소 전역 스타일
    ├── App.jsx               # 상태 관리 및 CRUD 함수 정의
    ├── components/
    │   ├── WeekNavigator.jsx # 주간 뷰 및 날짜 이동
    │   ├── TodoInput.jsx     # Todo 입력창
    │   ├── FilterTabs.jsx    # 필터 탭 (전체 / 진행 중 / 완료)
    │   ├── TodoList.jsx      # Todo 목록 렌더링
    │   └── TodoItem.jsx      # 개별 Todo 아이템 (인라인 수정 포함)
    ├── hooks/
    │   └── useLocalStorage.js  # localStorage 자동 동기화 훅
    └── utils/
        ├── date.js           # 날짜 계산 유틸 함수
        └── storage.js        # safeParseJSON 유틸 함수
```

---

## 주요 기능

### Todo CRUD

- **추가**: 입력창에 내용을 입력하고 추가 버튼을 클릭하거나 Enter를 누르면 Todo가 생성됩니다.
- **조회**: 현재 선택된 날짜와 필터 조건에 맞는 Todo를 표시합니다.
- **수정**: 수정 버튼을 누르면 인라인 입력창이 열립니다. Enter로 저장, Escape로 취소합니다.
- **완료 처리**: 완료 버튼을 누르면 완료 상태로 전환되고, 취소 버튼으로 되돌릴 수 있습니다.
- **삭제**: 삭제 버튼을 누르면 해당 Todo가 제거됩니다.

각 Todo의 데이터 구조는 다음과 같습니다.

```js
{ id: number, text: string, completed: boolean, date: "YYYY-MM-DD" }
```

### 입력 유효성 검사

- 빈 문자열로 추가 또는 수정을 시도하면 동작하지 않습니다.
- 추가 시 빈 입력이면 `"할 일을 입력해주세요."` 경고 메시지가 입력창 아래에 표시됩니다.
- 수정 시 빈 입력이면 저장되지 않고 입력창에 포커스가 유지됩니다.

### 필터링

세 가지 탭으로 현재 날짜의 Todo를 필터링합니다.

| 탭 | 조건 |
|---|---|
| 전체 | 모든 Todo |
| 진행 중 | `completed === false` |
| 완료 | `completed === true` |

필터를 변경한 뒤 새 Todo를 추가해도 필터 상태가 유지됩니다.

필터 조건에 해당하는 Todo가 없으면 다음 메시지를 표시합니다.

- 전체: `"이 날의 할 일이 없습니다."`
- 진행 중: `"진행 중인 할 일이 없습니다."`
- 완료: `"완료된 할 일이 없습니다."`

### 날짜별 Todo 관리

- Todo를 추가하면 현재 선택된 날짜(`selectedDate`)에 속하는 Todo로 저장됩니다.
- 날짜를 변경하면 해당 날짜의 Todo만 표시됩니다.
- 날짜는 `"YYYY-MM-DD"` 문자열 형태로 저장합니다.

### 주간 뷰 (WeekNavigator)

- 선택된 날짜가 속한 주의 월요일~일요일을 7개 날짜 셀로 표시합니다.
- 헤더에 주간 범위 라벨(예: `2025년 6월 2일 - 8일`)을 표시합니다.
- 이전 주 / 다음 주 버튼으로 `selectedDate`를 ±7일 이동합니다.
- 날짜 셀을 클릭하면 `selectedDate`가 해당 날짜로 변경됩니다.
- 오늘 날짜는 연한 보라색 원형으로, 선택된 날짜는 진한 보라색 원형으로 강조합니다.
- 토요일은 파란색, 일요일은 빨간색으로 표시합니다.
- 각 날짜 셀 아래에 해당 날짜의 Todo 개수를 표시합니다 (0개이면 빈칸).
- 선택 날짜가 오늘이 아닐 때만 `"오늘"` 버튼이 나타납니다.

---

## 상태 관리

`App.jsx`에서 다음 네 가지 상태를 관리합니다.

| 상태 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `todos` | `array` | `[]` | 전체 Todo 목록 |
| `nextId` | `number` | `1` | 다음 Todo에 부여할 고유 id |
| `currentFilter` | `string` | `"all"` | 현재 선택된 필터 |
| `selectedDate` | `string` | 오늘 날짜 | 현재 선택된 날짜 (`YYYY-MM-DD`) |

`todos`와 `nextId`는 `useLocalStorage` 훅으로 관리해 변경 시 자동으로 localStorage에 저장됩니다.  
`currentFilter`와 `selectedDate`는 `useState`로만 관리합니다(새로고침 시 초기화).

---

## localStorage 연동

### 저장 키

```js
const STORAGE_KEY_TODOS  = "todos";   // JSON 배열
const STORAGE_KEY_NEXTID = "nextId";  // 숫자
```

### 동작 방식

`useLocalStorage` 훅이 초기 마운트 시 localStorage에서 값을 읽어오고(`useState` 함수형 초기화),  
값이 변경될 때마다 `useEffect`로 자동 저장합니다.

```js
// App.jsx
const [todos, setTodos] = useLocalStorage(STORAGE_KEY_TODOS, [], Array.isArray);
const [nextId, setNextId] = useLocalStorage(
  STORAGE_KEY_NEXTID,
  1,
  (v) => typeof v === "number" && Number.isFinite(v)
);
```

### 안전한 파싱 및 타입 검증

localStorage에 저장된 데이터가 손상되었을 때 앱이 중단되지 않도록 두 단계로 보호합니다.

1. **`safeParseJSON`** (`utils/storage.js`): `JSON.parse`를 try/catch로 감싸 파싱 실패 시 fallback을 반환합니다.
2. **타입 검증**: `useLocalStorage`의 세 번째 인자로 validator 함수를 전달합니다. 파싱 결과가 검증을 통과하지 못하면 initialValue를 사용합니다.
   - `todos`: `Array.isArray`로 배열인지 확인 → 실패 시 `[]`
   - `nextId`: `typeof v === "number" && Number.isFinite(v)`로 유한 숫자인지 확인 → 실패 시 `1`

---

## IME Enter 중복 입력 방지

한국어처럼 IME(입력기)를 사용하는 환경에서는 조합 문자를 확정할 때 Enter 키가 발생합니다.  
이 Enter가 `onKeyDown` 핸들러에도 함께 전달되면 Todo가 의도치 않게 중복 추가되거나 저장될 수 있습니다.

`TodoInput`과 `TodoItem` 두 곳의 `handleKeyDown`에 다음 방어 코드를 추가했습니다.

```js
function handleKeyDown(e) {
  // IME 조합 중 Enter(조합 확정)는 무시한다
  if (e.nativeEvent.isComposing || e.keyCode === 229) return;
  if (e.key === "Enter") handleAdd(); // 또는 saveEdit()
}
```

- `e.nativeEvent.isComposing`: 현재 IME 조합 중인지 나타내는 표준 속성입니다.
- `e.keyCode === 229`: 일부 브라우저(구형 안드로이드 WebView 등)에서 IME 입력 중 keyCode가 229로 전달되는 경우를 추가 방어합니다.

---

## 날짜 유틸 함수 (`utils/date.js`)

| 함수 | 반환 타입 | 설명 |
|---|---|---|
| `getTodayStr()` | `string` | 오늘 날짜를 `"YYYY-MM-DD"`로 반환 |
| `toDateStr(date)` | `string` | `Date` 객체를 `"YYYY-MM-DD"`로 변환 |
| `dateStrToDate(dateStr)` | `Date` | `"YYYY-MM-DD"` 문자열을 `Date` 객체로 변환 |
| `getMondayOfWeek(dateStr)` | `Date` | 해당 날짜가 속한 주의 월요일 `Date` 반환 |
| `getWeekDates(dateStr)` | `string[]` | 해당 주의 월~일 7개 날짜 문자열 배열 반환 |
| `formatWeekRange(startStr, endStr)` | `string` | 주간 범위를 한국어 라벨로 포맷 |

---

## 컴포넌트별 역할

### `App.jsx`

- `todos`, `nextId`, `currentFilter`, `selectedDate` 상태 관리
- `addTodo`, `deleteTodo`, `toggleComplete`, `updateTodoText`, `moveDate`, `goToToday` 함수 정의
- 현재 날짜와 필터를 기준으로 `filteredTodos` 계산
- 하위 컴포넌트에 props 전달

### `WeekNavigator.jsx`

- `getWeekDates`로 7개 날짜 셀 렌더링
- 이전 주 / 다음 주 / 오늘 버튼 처리
- 오늘·선택·토·일 날짜 색상 구분
- 날짜별 Todo 개수 표시

### `TodoInput.jsx`

- 입력값(`text`)과 경고 메시지 표시 여부(`showWarning`)를 자체 state로 관리
- 추가 버튼 클릭 및 Enter 입력(IME 방어 포함) 처리
- 빈 입력 시 경고 메시지 표시, 입력 시 경고 자동 해제

### `FilterTabs.jsx`

- 전체 / 진행 중 / 완료 탭 렌더링
- 현재 선택 탭에 보라색 배경 스타일 적용

### `TodoList.jsx`

- 필터링된 Todo 목록 렌더링 (`key={todo.id}`)
- 목록이 비었을 때 필터별 안내 메시지 표시

### `TodoItem.jsx`

- `isEditing` 상태로 일반 표시 모드와 인라인 수정 모드 전환
- 수정 모드 진입 시 `useEffect`로 입력창에 자동 포커스 및 커서 위치 조정
- Enter 저장 / Escape 취소 / 빈 값 저장 차단 (포커스 유지)
- 완료 상태에 따라 취소선, 좌측 초록 보더, opacity 감소 스타일 적용

---

## 최종 체크리스트

| # | 항목 | 확인 방법 |
|---|---|---|
| 1 | `npm run dev` 실행 시 `localhost:5173` 정상 접속 | 브라우저에서 확인 |
| 2 | Todo 추가 (버튼 클릭 / Enter 키) | 입력 후 동작 확인 |
| 3 | 빈 입력 추가 시 경고 메시지 표시 | 빈 상태로 추가 버튼 클릭 |
| 4 | 인라인 수정 — Enter 저장 / Escape 취소 | 수정 버튼 클릭 후 확인 |
| 5 | 인라인 수정 — 빈 값 저장 시 포커스 유지 | 내용 지우고 Enter |
| 6 | 완료 처리 및 취소 (취소선·보더·opacity 변화) | 완료/취소 버튼 클릭 |
| 7 | 삭제 | 삭제 버튼 클릭 |
| 8 | 전체 / 진행 중 / 완료 필터 전환 | 탭 클릭 |
| 9 | 필터 상태 유지 후 Todo 추가 | 필터 바꾼 뒤 추가 |
| 10 | 날짜 클릭 시 해당 날짜 Todo만 표시 | 주간 뷰 날짜 셀 클릭 |
| 11 | 날짜별 Todo 독립 관리 | 서로 다른 날짜에 각각 추가 |
| 12 | 이전 주 / 다음 주 이동 | ‹ › 버튼 클릭 |
| 13 | 오늘 버튼 동작 및 오늘이면 버튼 숨김 | 다른 날짜로 이동 후 확인 |
| 14 | 각 날짜 셀 아래 Todo 개수 표시 | Todo 추가 후 주간 뷰 확인 |
| 15 | 새로고침 후 `todos`·`nextId` 유지 | 추가 후 F5 |
| 16 | 한국어 입력 중 조합 Enter로 중복 추가 없음 | 한국어 입력 후 조합 확정 Enter |
| 17 | 조합 끝난 뒤 Enter로 정상 추가 | 한국어 입력 완료 후 Enter |
| 18 | localStorage 손상 데이터 시 앱 정상 실행 | DevTools에서 `todos` 값을 `"garbage"`로 변조 후 새로고침 |
| 19 | 브라우저 콘솔에 에러 없음 | DevTools Console 탭 확인 |
