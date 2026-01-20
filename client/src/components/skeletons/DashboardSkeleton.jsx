const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-pulse">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />

      {/* Header Skeleton */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64" />
            </div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-full w-36" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="h-96 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-4" />
            <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-96 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;
