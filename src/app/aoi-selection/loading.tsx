export default function AOISelectionLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-2 h-8 w-64 animate-pulse rounded-md bg-gray-200"></div>
        <div className="mx-auto h-4 w-full max-w-3xl animate-pulse rounded-md bg-gray-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {/* Generate placeholder loading cards */}
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 p-3 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-6 animate-pulse rounded-full bg-gray-200"></div>
              </div>
              <div className="mt-1 h-8 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="mt-2 flex justify-end">
                <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
