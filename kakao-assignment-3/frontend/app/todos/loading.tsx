export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-28 bg-gray-300 rounded-full" />
          <div className="h-8 w-16 bg-gray-300 rounded-full" />
        </div>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-6 w-10 bg-gray-200 rounded-md" />
                <div className="h-6 w-10 bg-gray-200 rounded-md" />
                <div className="h-6 w-10 bg-gray-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
