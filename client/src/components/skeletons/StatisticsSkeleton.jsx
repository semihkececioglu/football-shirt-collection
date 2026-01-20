const StatisticsSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-pulse">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />

      {/* Header Skeleton */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16" />
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4" />
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
          </div>

          {/* Bar Chart Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-4" />
            <div className="flex items-end gap-2 h-64">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-t"
                  style={{ height: `${Math.random() * 60 + 40}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-36 mb-4" />
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>

          {/* Horizontal Bar Chart Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-44 mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                  <div
                    className="h-6 bg-slate-200 dark:bg-slate-700 rounded"
                    style={{ width: `${Math.random() * 40 + 30}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Valuable Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatisticsSkeleton;
