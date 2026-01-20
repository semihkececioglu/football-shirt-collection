const ShirtDetailSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Image Section Skeleton */}
        <div className="lg:col-span-2 space-y-3">
          {/* Main Image Skeleton */}
          <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-700 rounded-lg" />

          {/* Thumbnails Skeleton */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-md" />
            ))}
          </div>
        </div>

        {/* Details Section Skeleton */}
        <div className="lg:col-span-3 space-y-5">
          {/* Title Skeleton */}
          <div className="space-y-3">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>

          {/* Badges Skeleton */}
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Details Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 mx-auto mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12 mx-auto" />
              </div>
            ))}
          </div>

          {/* Player Info Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 mx-auto mb-2" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24 mx-auto" />
              </div>
            ))}
          </div>

          {/* Financial Info Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 mx-auto mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mx-auto" />
              </div>
            ))}
          </div>

          {/* Notes Section Skeleton */}
          <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShirtDetailSkeleton;
