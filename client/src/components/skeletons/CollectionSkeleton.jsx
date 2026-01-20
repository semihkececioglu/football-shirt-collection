import ShirtCardSkeleton from "@/components/shirt/ShirtCardSkeleton";

const CollectionSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-pulse">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />

      {/* Header Skeleton */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-full w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 h-10 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700" />

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              />
            ))}
          </div>
        </div>

        {/* Active Filters Skeleton */}
        <div className="flex gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"
            />
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {[...Array(12)].map((_, i) => (
            <ShirtCardSkeleton key={i} />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollectionSkeleton;
