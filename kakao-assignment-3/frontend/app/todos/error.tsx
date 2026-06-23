"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          오류가 발생했습니다
        </h2>
        <p className="text-sm text-gray-500 mb-6 break-words">{error.message}</p>
        <button
          onClick={reset}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-colors text-sm"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
