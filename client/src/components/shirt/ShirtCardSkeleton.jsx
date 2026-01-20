import { Card } from "@/components/ui/card";

const ShirtCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col p-0 animate-pulse">
      {/* Image skeleton with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-700" />

      {/* Content skeleton */}
      <div className="px-2 pt-1.5 pb-2 flex-1 flex flex-col">
        {/* Team name skeleton */}
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-1" />

        {/* Season + type skeleton */}
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-0.5" />

        {/* Bottom actions skeleton */}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700">
          {/* Heart button skeleton */}
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full" />

          {/* Menu button skeleton */}
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    </Card>
  );
};

export default ShirtCardSkeleton;
