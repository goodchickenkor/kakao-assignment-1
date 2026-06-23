# Todo App — Next.js + FastAPI

Vite + React 기반 Todo 앱을 Next.js App Router + FastAPI 풀스택 구조로 마이그레이션한 프로젝트.

---

## 기술 스택

### Frontend
| 항목 | 버전 |
|------|------|
| Next.js (App Router) | 16.x |
| React | 19.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Axios | 1.x |

### Backend
| 항목 | 버전 |
|------|------|
| FastAPI | 0.138+ |
| Uvicorn | 0.49+ |
| SQLAlchemy | 2.x |
| SQLite | — |
| Pydantic | 2.x |

---

## 폴더 구조

```
kakao-assignment-3/
├── backend/
│   ├── main.py              # FastAPI 앱 (모델, 스키마, 라우터 전체)
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── app/
    │   ├── api/
    │   │   └── todos/
    │   │       ├── route.ts          # GET /api/todos, POST /api/todos
    │   │       └── [todoId]/
    │   │           └── route.ts      # GET/PUT/DELETE /api/todos/[todoId]
    │   ├── todos/
    │   │   ├── [todoId]/
    │   │   │   └── page.tsx          # 수정 페이지
    │   │   ├── new/
    │   │   │   └── page.tsx          # 생성 페이지
    │   │   ├── error.tsx             # 에러 경계 (Client Component)
    │   │   ├── loading.tsx           # 로딩 스켈레톤
    │   │   └── page.tsx              # 목록 페이지 (Server Component)
    │   ├── actions.ts                # Server Actions (CRUD + 캐시 갱신)
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx                  # 루트 → /todos 이동
    ├── components/
    │   ├── TodoFilter.tsx            # 필터 탭 (Client Component)
    │   ├── TodoForm.tsx              # 생성/수정 공통 폼 (Client Component)
    │   ├── TodoItem.tsx              # 할 일 행 (Server Component)
    │   ├── TodoSearch.tsx            # 검색창 (Client Component)
    │   └── WeekNavigator.tsx         # 주간 뷰 (Client Component)
    ├── lib/
    │   ├── api.ts                    # FastAPI 호출 유틸 (Axios)
    │   └── date.ts                   # 날짜 포맷/주간 계산 유틸
    ├── types/
    │   └── todo.ts                   # Todo, TodoFilter, GetTodosParams 타입
    ├── .env.example
    ├── .env.local                    # 실제 환경변수 (Git 제외)
    └── next.config.ts
```

---

## 실행 방법

### 백엔드

```bash
cd backend

# 가상환경 생성 (최초 1회)
python -m venv .venv

# 가상환경 활성화
.\.venv\Scripts\activate        # Windows
# source .venv/bin/activate     # macOS/Linux

# 패키지 설치 (최초 1회)
pip install -r requirements.txt

# 서버 실행
uvicorn main:app --reload
```

- 서버 주소: `http://localhost:8000`
- API 문서: `http://localhost:8000/docs`
- DB 파일: `todos.db` (자동 생성, Git 제외)

### 프론트엔드

```bash
cd frontend

# 환경변수 설정 (최초 1회)
cp .env.example .env.local

# 패키지 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

- 접속 주소: `http://localhost:3000`
- 프로덕션 빌드: `npm run build && npm run start`

---

## 환경변수

### `frontend/.env.local`

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | 클라이언트에서 Next.js API Route 호출 시 base URL |
| `BACKEND_URL` | `http://localhost:8000` | 서버(Server Action, route.ts)에서 FastAPI 호출 시 base URL |

> `BACKEND_URL`은 서버에서만 참조하므로 `NEXT_PUBLIC_` 접두사 없이 사용합니다.

### `backend/.env` (선택)

```
DATABASE_URL=sqlite:///./todos.db
```

---

## 구현 기능

| 기능 | 설명 |
|------|------|
| Todo 목록 조회 | Server Component에서 FastAPI 호출 |
| Todo 생성 | `/todos/new` 페이지, Server Action |
| Todo 수정 | `/todos/[todoId]` 페이지, Server Action |
| Todo 완료/취소 | 목록에서 버튼 클릭, Server Action form |
| Todo 삭제 | 목록에서 버튼 클릭, Server Action form |
| 필터 (전체/진행중/완료) | URL `?filter=` 기반, FastAPI 서버 필터링 |
| 키워드 검색 | URL `?search=` 기반, 300ms debounce, FastAPI `ILIKE` 검색 |
| 날짜별 조회 | URL `?date=YYYY-MM-DD` 기반, FastAPI 날짜 필터링 |
| 주간 뷰 | 월~일 7일 표시, 이전/다음 주 이동, 날짜별 Todo 개수 표시 |
| 오늘 날짜 강조 | 보라색 링 표시 |
| 주말 색상 구분 | 토요일 파란색, 일요일 빨간색 |
| 빈 목록 메시지 | 조건에 맞는 상황별 안내 메시지 |
| 로딩 UI | `loading.tsx` 스켈레톤 |
| 에러 UI | `error.tsx` Client Component 에러 경계 |
| 404 처리 | 존재하지 않는 todoId → `notFound()` |

---

## Server Component vs Client Component

| 컴포넌트 | 종류 | 이유 |
|----------|------|------|
| `app/todos/page.tsx` | Server Component | 서버에서 Todo 목록 fetch, searchParams 읽기 |
| `app/todos/[todoId]/page.tsx` | Server Component | 서버에서 단일 Todo fetch |
| `app/todos/new/page.tsx` | Server Component | Server Action 참조만 전달 |
| `components/TodoItem.tsx` | Server Component | Server Action form 사용, 상태 없음 |
| `components/TodoForm.tsx` | Client Component | `onKeyDown` 이벤트 핸들러 (IME 방어) 필요 |
| `components/TodoFilter.tsx` | Client Component | `useRouter`로 URL 조작 |
| `components/TodoSearch.tsx` | Client Component | `useState` + debounce + `useRouter` |
| `components/WeekNavigator.tsx` | Client Component | `useRouter`로 날짜/주간 URL 조작 |
| `app/todos/error.tsx` | Client Component | Next.js 에러 경계 규칙 (필수) |

---

## `route.ts` vs `actions.ts` 역할 차이

### `app/api/todos/route.ts` — Next.js API Route (BFF 프록시)

- HTTP 요청을 받아 FastAPI로 그대로 전달
- 클라이언트(브라우저 JS)에서 직접 호출하거나 외부 도구에서 사용 가능
- `BACKEND_URL`을 서버 환경변수에서 읽어 FastAPI 주소를 클라이언트에 노출하지 않음
- query parameter(`filter`, `search`, `date`) 투명하게 전달

### `app/actions.ts` — Server Actions

- `"use server"` 지시어로 서버에서만 실행되는 함수
- `lib/api.ts`를 통해 FastAPI를 직접 호출 (route.ts를 거치지 않음)
- 변경 작업 후 `revalidatePath("/todos")`로 Next.js 캐시 무효화
- 생성/수정 후 `redirect("/todos")`로 자동 이동
- Client Component에서 form `action` prop으로 호출 가능

```
[Client Component]
  → form action={serverAction}    // Server Action 경로
  → [서버] actions.ts
  → lib/api.ts → FastAPI → SQLite

[브라우저 JS / 외부 도구]
  → fetch("/api/todos")           // Route Handler 경로
  → app/api/todos/route.ts
  → FastAPI → SQLite
```

---

## localStorage → 서버 API로 바뀐 점

| 항목 | 기존 (Vite + React) | 이번 과제 (Next.js + FastAPI) |
|------|---------------------|-------------------------------|
| 데이터 저장 | `localStorage` | SQLite (FastAPI 관리) |
| ID 생성 | 클라이언트 `nextId` 순차 정수 | 서버 `uuid.uuid4()` |
| 상태 관리 | `useState` + `useLocalStorage` | URL query parameter + Server Component fetch |
| 필터링 | 클라이언트 `Array.filter` | FastAPI 쿼리 파라미터 (`?filter=`) |
| 검색 | 없음 | FastAPI `ILIKE` 검색 (`?search=`) |
| 새로고침 유지 | localStorage 읽기 | DB에서 재조회 |
| 에러 방어 | `safeParseJSON` try-catch | `ApiError` 클래스, 에러 경계(`error.tsx`) |

---

## 튜터 피드백 반영

### 1. IME Enter 중복 입력 방어 유지

`TodoForm.tsx`와 `TodoSearch.tsx`의 텍스트 입력에 적용:

```tsx
function handleTextKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter" && (e.nativeEvent.isComposing || e.keyCode === 229)) {
    e.preventDefault(); // 한국어 IME 조합 중 Enter → 폼 제출 차단
  }
}
```

- `isComposing`: 표준 IME 조합 중 감지
- `keyCode === 229`: 일부 브라우저/OS 호환성 보조

### 2. `isEditing` 로컬 상태 문제 해결

기존 React 앱에서는 `TodoItem` 내부에 `isEditing` 상태가 있어 여러 항목이 동시에 편집 모드가 될 수 있었습니다.

이번 구현에서는 **수정 페이지(`/todos/[todoId]`)로 분리**했습니다. 목록 페이지에서는 수정 버튼이 단순한 링크로 동작하고, 실제 편집은 독립된 페이지에서만 이루어집니다. 인라인 편집 자체가 없으므로 동시 수정 문제가 구조적으로 발생하지 않습니다.

### 3. `nextId` 제거 → 서버 UUID 생성

```python
# backend/main.py
new_todo = TodoModel(
    id=str(uuid.uuid4()),  # 서버에서 UUID 생성
    ...
)
```

- 클라이언트는 서버가 응답한 `id`만 사용
- ID 충돌 가능성 없음
- `localStorage`의 `nextId` 완전 제거
