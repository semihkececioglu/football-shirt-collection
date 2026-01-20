import { useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Check, RotateCcw } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function SortableTableHead({
  children,
  sortKey,
  currentSort,
  onSortChange,
  className,
  align = "left",
}) {
  const [open, setOpen] = useState(false);

  // Detect if this column is currently sorted
  const isAscending = currentSort === sortKey;
  const isDescending = currentSort === `-${sortKey}`;
  const isActive = isAscending || isDescending;

  // Determine which icon to show
  const SortIcon = isAscending
    ? ArrowUp
    : isDescending
    ? ArrowDown
    : ArrowUpDown;

  const options = [
    { label: "Asc", value: sortKey, icon: ArrowUp },
    { label: "Desc", value: `-${sortKey}`, icon: ArrowDown },
    { label: "Default", value: "-createdAt", icon: RotateCcw },
  ];

  const handleOptionClick = (value) => {
    onSortChange(value);
    setOpen(false); // Close popover after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TableHead
          className={cn(
            "cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/50",
            align === "right" && "text-right",
            className
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1",
              align === "right" && "justify-end"
            )}
          >
            <span>{children}</span>
            <SortIcon
              className={cn(
                "w-3.5 h-3.5",
                isActive
                  ? "text-slate-600 dark:text-slate-400"
                  : "text-slate-400 dark:text-slate-600"
              )}
            />
          </div>
        </TableHead>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        align={align === "right" ? "end" : "start"}
      >
        <div className="py-1">
          {options.map((option) => {
            const isSelected = currentSort === option.value;
            const OptionIcon = option.icon;

            return (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={cn(
                  "w-full px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between",
                  isSelected && "bg-slate-50 dark:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <OptionIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{option.label}</span>
                </div>
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
