# CLAUDE.md

이 프로젝트는 React(Vite) 기반 Todo 앱을 Next.js + FastAPI 풀스택 구조로 마이그레이션하는 과제이다.

## 작업 원칙

- Next.js App Router를 사용한다.
- frontend/와 backend/를 명확히 분리한다.
- frontend는 TypeScript 기반 Next.js로 작성한다.
- backend는 FastAPI + SQLAlchemy + SQLite로 작성한다.
- localStorage 기반 데이터 관리는 제거하고 서버 API 기반 데이터 흐름으로 전환한다.
- 기존 React Todo 앱의 UI 느낌은 최대한 유지한다.
- 불필요한 console.log와 사용하지 않는 코드는 남기지 않는다.
- node_modules, dist, .env.local, todos.db, .venv는 Git에 포함하지 않는다.

## 이전 과제 피드백 반영

- IME 조합 중 Enter 중복 입력 방어를 유지한다.
- TodoInput과 TodoItem에서 사용했던 isComposing / keyCode 229 방어 개념을 새 폼에도 반영한다.
- 기존 nextId 방식은 제거하고, ID는 서버에서 생성한다.
- 인라인 수정 기능을 유지할 경우 isEditing은 TodoItem 내부가 아니라 상위 editingId로 관리한다.
- 가능하면 수정은 /todos/[todoId] 페이지에서 처리한다.

## 작업 방식

- 먼저 계획을 설명한 뒤 파일을 수정한다.
- 한 번에 너무 많은 기능을 만들기보다 단계별로 구현한다.
- 작업 후 생성/수정한 파일과 확인 방법을 요약한다.
