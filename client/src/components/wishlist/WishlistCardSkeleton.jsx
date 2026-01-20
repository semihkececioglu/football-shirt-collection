const WishlistCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Team name and season */}
          <div className="flex items-baseline gap-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          {/* Priority badge skeleton */}
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
          {/* Menu button skeleton */}
          <div className="h-7 w-7 bg-slate-200 dark:bg-slate-700 rounded-md" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Max budget */}
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        {/* Notes */}
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      </div>
    </div>
  );
};

export default WishlistCardSkeleton;
