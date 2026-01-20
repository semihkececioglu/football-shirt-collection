import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function FilterPopover({
  label,
  value, // Single string value
  options,
  onValueChange, // Receives single string value
  icon: Icon,
}) {
  const hasActiveFilter = value && value !== "all";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 text-xs",
            hasActiveFilter && "border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-800"
          )}
        >
          {Icon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <div className="max-h-80 overflow-y-auto py-1">
          {options.map((option) => {
            const isSelected = value === option.value || (!value && option.value === "all");

            return (
              <button
                key={option.value}
                onClick={() => onValueChange(option.value)}
                className={cn(
                  "w-full px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between",
                  isSelected && "bg-slate-50 dark:bg-slate-800/50"
                )}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
