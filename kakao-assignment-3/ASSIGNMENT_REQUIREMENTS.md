현재 Vite + React로 구현된 Todo 앱을 과제 요구사항에 맞게 Next.js + FastAPI 풀스택 구조로 마이그레이션해줘.

## 현재 상황

현재 프로젝트는 React(Vite) 기반 Todo 앱이다.

기존 주요 기능은 다음과 같다.

- Todo 추가 / 조회 / 수정 / 완료 처리 / 삭제
- 빈 입력값 경고 메시지
- 전체 / 진행 중 / 완료 필터링
- 날짜별 Todo 관리
- 주간 뷰
- 이전 주 / 다음 주 이동
- 오늘 날짜 강조
- 날짜별 Todo 개수 표시
- localStorage 저장
- safeParseJSON 기반 localStorage 파싱 예외 처리
- 한국어 IME 조합 중 Enter 중복 입력 방지
- TodoInput과 TodoItem에서 `isComposing || keyCode === 229` 방어 처리

이번 과제에서는 이 앱을 Next.js App Router + FastAPI + SQLite 구조로 다시 만들어야 한다.

## 과제 요구 스택

### Frontend

- Next.js v15+
- React v18+
- TypeScript v5
- Tailwind CSS v4
- Axios
- App Router 사용
- `src/` directory 사용하지 않음
- `pages/` 라우터 사용하지 않음

### Backend

- FastAPI v0.111+
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic v2

## 최종 프로젝트 구조

아래 구조로 만들어줘.

```txt
kakao-assignment-3/
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   └── todos/
│   │   │       ├── route.ts
│   │   │       └── [todoId]/
│   │   │           └── route.ts
│   │   ├── todos/
│   │   │   ├── [todoId]/
│   │   │   │   └── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoForm.tsx
│   │   ├── TodoFilter.tsx
│   │   ├── TodoSearch.tsx
│   │   └── WeekNavigator.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── date.ts
│   ├── types/
│   │   └── todo.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── postcss.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── backend/
    ├── main.py
    ├── requirements.txt
    ├── .env.example
    └── .gitignore
```

필요하면 파일 구조를 더 정리해도 되지만, App Router 구조와 frontend/backend 분리는 반드시 유지해줘.

## 중요한 마이그레이션 방향

기존 React 앱은 localStorage 기반이었지만, 이번 과제에서는 FastAPI 서버와 SQLite DB가 Todo 데이터를 관리해야 한다.

따라서 다음처럼 바꿔줘.

### 기존 방식

```txt
React state
→ localStorage
```

### 변경할 방식

```txt
Next.js page/component
→ Server Actions 또는 route.ts
→ FastAPI
→ SQLite
```

localStorage 기반 `useLocalStorage`, `safeParseJSON`, `nextId` 관리는 더 이상 핵심 데이터 저장 방식으로 사용하지 않는다.

다만 튜터 피드백에서 좋다고 한 안정성 개선 방향은 이어가야 한다.

- IME Enter 중복 입력 방지 유지
- 입력값 검증 유지
- AI가 생성한 코드도 직접 이해하기 쉬운 구조와 주석 유지
- ID 충돌 가능성을 줄이기 위해 클라이언트에서 순차 정수 id를 직접 만들지 않기

## 튜터 피드백 반영

이전 과제 피드백을 다음 방식으로 반영해줘.

### 1. isEditing 로컬 상태 개선

이전 React 앱에서는 `TodoItem` 내부에 `isEditing` 상태가 있어서 여러 Todo가 동시에 수정 모드가 될 수 있었다.

이번 Next.js 버전에서는 기본적으로 `/todos/[todoId]` 수정 페이지를 사용하므로 동시에 여러 항목이 인라인 수정되는 문제를 피할 수 있다.

만약 Todo 목록에서 인라인 수정 UI를 일부 유지한다면, `TodoItem` 내부의 `isEditing`으로 관리하지 말고 상위 컴포넌트에서 `editingId`를 관리하는 방식으로 구현해줘.

### 2. 순차 정수 nextId 제거

기존 React 앱에서는 `nextId`를 localStorage에 저장해서 순차 정수 id를 만들었다.

이번에는 클라이언트에서 id를 생성하지 말고 FastAPI/DB에서 id를 생성해줘.

가능하면 Todo id는 UUID 문자열을 사용해줘.

- Python backend에서 `uuid.uuid4()`로 id 생성
- SQLAlchemy 모델의 `id`는 `String` primary key
- 프론트엔드는 서버가 응답한 id만 사용

만약 DB auto increment 정수를 사용한다면, 클라이언트에서 `nextId`를 절대 만들지 않도록 해줘.

## Backend 요구사항

`backend/main.py`에 FastAPI 앱을 구현해줘.

### DB

SQLite 사용.

기본 DB URL은 환경변수에서 읽고, 없으면 기본값으로 사용해줘.

```txt
DATABASE_URL=sqlite:///./todos.db
```

### Todo 모델

기존 React 앱의 기능을 최대한 유지하기 위해 Todo 데이터는 다음 필드를 갖게 해줘.

```txt
id: string
text: string
completed: boolean
date: string
```

`date`는 `"YYYY-MM-DD"` 문자열이다.

SQLAlchemy 모델 예시 방향:

```python
id = Column(String, primary_key=True, index=True)
text = Column(String, nullable=False)
completed = Column(Boolean, default=False)
date = Column(String, nullable=False)
```

### Pydantic 스키마

다음 스키마를 만들어줘.

- `TodoCreate`
- `TodoUpdate`
- `TodoRead`

요구사항:

- 생성 시 `text`, `date` 필요
- 수정 시 `text`, `completed`, `date`는 선택적으로 수정 가능
- 빈 문자열 text는 허용하지 않기
- 응답에는 `id`, `text`, `completed`, `date` 포함

### API 엔드포인트

다음 엔드포인트를 구현해줘.

| Method | URL           | 설명           |
| ------ | ------------- | -------------- |
| GET    | `/todos`      | Todo 목록 조회 |
| POST   | `/todos`      | Todo 생성      |
| GET    | `/todos/{id}` | Todo 단일 조회 |
| PUT    | `/todos/{id}` | Todo 수정      |
| DELETE | `/todos/{id}` | Todo 삭제      |

추가로 도전 미션을 위해 다음 쿼리 파라미터도 지원해줘.

```txt
GET /todos?filter=active
GET /todos?filter=completed
GET /todos?search=키워드
GET /todos?filter=active&search=키워드
GET /todos?date=YYYY-MM-DD
```

필터 조건:

- `all` 또는 없음: 전체
- `active`: `completed == False`
- `completed`: `completed == True`

검색 조건:

- `text`에 검색어가 포함된 Todo 조회
- 대소문자 구분은 크게 중요하지 않지만 가능하면 case-insensitive로 처리

날짜 조건:

- `date`가 주어진 값과 같은 Todo 조회

### CORS

Next.js 프론트엔드에서 접근할 수 있도록 CORS를 설정해줘.

개발 환경 기준:

```txt
http://localhost:3000
```

### 실행 확인

`backend/requirements.txt`를 작성해줘.

필수 패키지:

```txt
fastapi>=0.111.0
uvicorn[standard]>=0.29.0
sqlalchemy>=2.0.0
pydantic>=2.0.0
python-dotenv>=1.0.0
```

실행 명령:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

`localhost:8000/docs`에서 API 문서가 보여야 한다.

## Frontend 요구사항

`frontend/`는 Next.js App Router 기반으로 구현해줘.

### 환경변수

`frontend/.env.example`에는 다음 내용을 넣어줘.

```txt
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:8000
```

실제 `.env.local`은 git에 올리지 않도록 `.gitignore`에 포함해줘.

### API 연동 구조

다음 역할을 구분해줘.

### `app/api/todos/route.ts`

Next.js API Route로 FastAPI를 프록시한다.

- `GET /api/todos`
- `POST /api/todos`

쿼리 파라미터 `filter`, `search`, `date`를 FastAPI로 전달해야 한다.

### `app/api/todos/[todoId]/route.ts`

- `GET /api/todos/{todoId}`
- `PUT /api/todos/{todoId}`
- `DELETE /api/todos/{todoId}`

### `app/actions.ts`

Server Actions를 정의한다.

필요한 함수:

- `getTodos`
- `getTodo`
- `createTodo`
- `updateTodo`
- `deleteTodo`
- `toggleTodo`

Server Action 내부에서 FastAPI를 호출하고, 변경 후에는 `revalidatePath("/todos")`를 사용해 목록을 갱신해줘.

생성 후에는 `/todos`로 redirect해줘.

수정 후에도 `/todos`로 redirect해줘.

## 페이지 요구사항

### `/`

루트 페이지는 `/todos`로 이동하거나, Todo 앱 소개와 `/todos` 이동 버튼을 보여줘.

### `/todos`

Todo 목록 페이지.

요구사항:

- Server Component로 구현
- `searchParams`에서 `filter`, `search`, `date` 읽기
- 서버에서 Todo 목록 가져오기
- Todo 목록 표시
- 완료/취소 버튼
- 삭제 버튼
- 수정 페이지로 이동하는 버튼
- 새 Todo 작성 페이지로 이동하는 버튼
- 필터 탭
- 검색창
- 주간 날짜 선택 UI
- 빈 목록 메시지

기존 React 앱의 UI 느낌을 최대한 유지해줘.

### `/todos/new`

Todo 생성 페이지.

요구사항:

- 할 일 내용 입력
- 날짜 입력 또는 선택
- 기본 날짜는 오늘
- 빈 입력값 방지
- 생성 버튼
- 취소 시 `/todos`로 이동
- 한국어 IME 조합 중 Enter로 중복 제출되지 않도록 주의

### `/todos/[todoId]`

Todo 수정 페이지.

요구사항:

- 기존 Todo 내용 불러오기
- text 수정
- date 수정 가능
- completed 상태 표시 또는 변경 가능
- 저장 버튼
- 취소 버튼
- 존재하지 않는 id면 적절한 에러 처리

### `/todos/loading.tsx`

목록 데이터를 불러오는 동안 보여줄 로딩 UI 구현.

### `/todos/error.tsx`

Todo 페이지에서 에러 발생 시 보여줄 에러 UI 구현.

`error.tsx`는 Client Component여야 한다.

## 컴포넌트 요구사항

기존 React 앱의 컴포넌트 역할을 Next.js 구조에 맞게 변환해줘.

### `TodoList.tsx`

- Todo 배열을 받아 목록 렌더링
- 빈 상태 메시지 표시

### `TodoItem.tsx`

- Todo 텍스트, 완료 상태, 날짜 표시
- 완료/취소
- 삭제
- 수정 페이지 이동
- 가능하면 Server Action form 기반으로 처리

### `TodoForm.tsx`

- 생성/수정 공통 form으로 사용
- text 입력
- date 입력
- completed 입력은 수정 모드에서만 표시해도 됨
- 빈 입력 방지
- IME 조합 중 Enter 중복 제출 방지

폼 입력과 키보드 이벤트가 필요하므로 Client Component로 구현해도 된다.

### `TodoFilter.tsx`

- 전체 / 진행 중 / 완료 탭
- 필터 상태는 `useState`가 아니라 URL query parameter로 관리
- 예: `/todos?filter=active`
- `useSearchParams`를 사용한다면 Suspense로 감싸거나 구조상 에러가 나지 않게 처리

### `TodoSearch.tsx`

- 검색어 입력
- 검색어는 `?search=키워드` 형태로 URL에 반영
- 기존 filter와 date query가 유지되어야 함
- 너무 많은 요청을 막기 위해 간단한 debounce를 적용해도 좋음

### `WeekNavigator.tsx`

기존 React 앱의 주간 뷰를 Next.js에서도 유지해줘.

- 선택된 날짜는 `date=YYYY-MM-DD` query parameter로 관리
- 날짜 클릭 시 URL이 변경됨
- 오늘 날짜 강조
- 선택된 날짜 강조
- 토요일/일요일 색상 구분
- 날짜별 Todo 개수 표시
- 이때 Todo 개수는 현재 전체 Todo 목록 기준으로 계산해도 되고, 필요하다면 백엔드에서 날짜별 count를 따로 제공하지 않아도 됨

## 기존 기능 중 변경되는 점

### localStorage 제거

기존의 `useLocalStorage`, `safeParseJSON`, `nextId` 기반 저장 방식은 이번 과제에서는 사용하지 않는다.

대신 FastAPI와 SQLite가 데이터를 관리한다.

단, safeParseJSON처럼 예외를 방어하던 태도는 API 요청/응답 에러 처리에 반영해줘.

### nextId 제거

기존 `nextId`는 제거한다.

id는 백엔드에서 생성한다.

### 필터링 방식 변경

기존 React 앱에서는 `useState`로 필터를 관리했다.

이번에는 URL query parameter로 관리한다.

예시:

```txt
/todos
/todos?filter=active
/todos?filter=completed
```

그리고 FastAPI에서 서버 기반으로 필터링한다.

### 검색 기능 추가

기존 React 앱에는 검색 기능이 없었지만, 도전 미션 요구사항에 따라 서버 기반 검색 기능을 추가해줘.

예시:

```txt
/todos?search=운동
/todos?filter=active&search=운동
```

## UI/UX 요구사항

기존 React Todo 앱의 디자인 느낌을 최대한 유지해줘.

- 보라색 primary color 유지
- 중앙 정렬된 카드형 레이아웃
- 흰색 카드와 회색 배경
- 완료된 Todo는 취소선과 opacity로 구분
- 버튼 색상 구분
  - 추가/저장: 보라색
  - 수정: 연보라색
  - 완료: 초록색
  - 삭제: 빨간색

- 빈 목록 메시지 표시
- 모바일에서도 깨지지 않게 반응형 고려

## TypeScript 타입

`types/todo.ts`에 Todo 타입을 정의해줘.

예시:

```ts
export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
};

export type TodoFilter = "all" | "active" | "completed";
```

## README 작성

`frontend/README.md` 또는 루트 `README.md`에 다음 내용을 정리해줘.

- 프로젝트 소개
- 기술 스택
- 폴더 구조
- 실행 방법
- 백엔드 실행 방법
- 프론트엔드 실행 방법
- 구현 기능
- Server Component와 Client Component 구분
- route.ts와 actions.ts의 역할 차이
- localStorage 기반 방식에서 서버 API 기반 방식으로 바뀐 점
- 환경변수 설명
- 튜터 피드백 반영 내용
  - IME Enter 방어 유지
  - isEditing 로컬 상태 문제 해결 방식
  - nextId 제거 및 서버 ID 생성 방식

## 검증 기준

작업 완료 후 다음이 가능해야 한다.

### Backend

- `cd backend`
- `.venv` 활성화
- `pip install -r requirements.txt`
- `uvicorn main:app --reload`
- `http://localhost:8000` 접속 시 서버 응답
- `http://localhost:8000/docs`에서 API 문서 확인
- `/todos` CRUD 테스트 가능
- `todos.db` 생성 확인

### Frontend

- `cd frontend`
- `npm install`
- `.env.local` 설정
- `npm run dev`
- `http://localhost:3000` 접속
- `/todos` 목록 페이지 표시
- Todo 생성 가능
- Todo 수정 가능
- Todo 완료/취소 가능
- Todo 삭제 가능
- 필터 탭 동작
- 검색 동작
- 날짜 선택 동작
- 새로고침 후에도 DB 데이터 유지
- 브라우저 콘솔 에러 없음
- `npm run build` 성공

## 작업 방식

단순히 설명만 하지 말고 실제 파일을 생성하고 수정해줘.

작업 전에는 간단히 마이그레이션 계획을 요약하고, 그 다음 실제 구현을 진행해줘.

작업이 끝나면 다음을 요약해줘.

1. 생성/수정한 파일 목록
2. 프론트엔드 실행 방법
3. 백엔드 실행 방법
4. 기존 React 앱과 달라진 점
5. 튜터 피드백을 어떻게 반영했는지
6. 직접 확인해야 할 체크리스트
