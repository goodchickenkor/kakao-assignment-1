import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-purple-600 mb-3">Todo App</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Next.js + FastAPI로 만든 할 일 관리 앱
        </p>
        <Link
          href="/todos"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
