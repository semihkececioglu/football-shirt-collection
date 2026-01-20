import { Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = ({
  icon: IconComponent = Shirt,
  title = "No items found",
  description,
  action,
  actionLabel,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full blur-2xl opacity-30" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
          <IconComponent className="w-9 h-9 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-sm text-center space-y-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Button */}
      {action && actionLabel && (
        <div className="mt-6">
          <Button onClick={action} size="sm" className="h-9">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
