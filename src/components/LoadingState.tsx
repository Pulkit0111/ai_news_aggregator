export default function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <div
          key={i}
          className="border-4 border-black bg-white animate-pulse h-[400px] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          {/* Gradient bar */}
          <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>

          <div className="p-6 flex flex-col flex-grow">
            {/* Categories skeleton */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 border-2 border-gray-300 w-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"></div>
              <div className="h-6 bg-gray-200 border-2 border-gray-300 w-16 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"></div>
            </div>

            {/* Title skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-5 bg-gray-200 w-full"></div>
              <div className="h-5 bg-gray-200 w-5/6"></div>
            </div>

            {/* Summary skeleton */}
            <div className="space-y-2 mb-4 flex-grow">
              <div className="h-4 bg-gray-200 w-full"></div>
              <div className="h-4 bg-gray-200 w-full"></div>
              <div className="h-4 bg-gray-200 w-3/4"></div>
            </div>

            {/* Metadata skeleton */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-black mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 border-2 border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 w-24"></div>
                  <div className="h-3 bg-gray-200 w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 border-2 border-gray-300 w-16 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
