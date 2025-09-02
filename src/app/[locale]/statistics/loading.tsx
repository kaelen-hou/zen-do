
export default function Loading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-md bg-gray-300"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Statistics cards loading */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-white p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
                </div>
                <div className="mb-1 h-8 w-16 animate-pulse rounded bg-gray-400"></div>
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </div>

          {/* Charts loading */}
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-white p-6">
                <div className="mb-4 space-y-2">
                  <div className="h-6 w-32 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-gray-300"></div>
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                      </div>
                      <div className="h-4 w-8 animate-pulse rounded bg-gray-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}