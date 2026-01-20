import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";

export function MultiFilterPopover({
  label,
  values = [],
  options,
  onValuesChange,
  icon: Icon,
}) {
  const hasActiveFilter = values && values.length > 0;

  const handleOptionClick = (optionValue) => {
    if (optionValue === "all") {
      onValuesChange([]);
      return;
    }

    const newValues = values.includes(optionValue)
      ? values.filter((v) => v !== optionValue)
      : [...values, optionValue];

    onValuesChange(newValues);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 text-sm gap-1.5",
            hasActiveFilter && "border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-800"
          )}
        >
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span className="truncate">{label}</span>
          {hasActiveFilter && (
            <span className="ml-0.5 px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded-full">
              {values.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="min-w-[180px] max-h-80 overflow-y-auto p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
      >
        <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
          {options.map((option) => {
            const isSelected = option.value === "all"
              ? values.length === 0
              : values.includes(option.value);

            return (
              <DropdownMenuHighlightItem key={option.value} value={option.value}>
                <DropdownMenuItem
                  className="relative flex items-center justify-between w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleOptionClick(option.value);
                  }}
                >
                  <span>{option.label}</span>
                  <AnimatePresence mode="wait">
                    {isSelected && (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-slate-600 dark:text-slate-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DropdownMenuItem>
              </DropdownMenuHighlightItem>
            );
          })}
        </DropdownMenuHighlight>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
