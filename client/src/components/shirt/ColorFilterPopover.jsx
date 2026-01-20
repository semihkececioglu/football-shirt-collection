import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";

// Color hex map for visual display
const COLOR_HEX_MAP = {
  red: "#EF4444",
  blue: "#3B82F6",
  yellow: "#EAB308",
  green: "#22C55E",
  black: "#171717",
  white: "#FFFFFF",
  orange: "#F97316",
  purple: "#A855F7",
  pink: "#EC4899",
  navy: "#1E3A8A",
  gray: "#6B7280",
  gold: "#CA8A04",
};

export function ColorFilterPopover({
  label,
  value,
  onValueChange,
  availableColors = [],
  t,
}) {
  const hasActiveFilter = value && value !== "all";
  const selectedColorHex = COLOR_HEX_MAP[value];

  const colorOptions = availableColors.map((colorValue) => ({
    value: colorValue,
    hex: COLOR_HEX_MAP[colorValue] || "#6B7280",
  }));

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
          {selectedColorHex ? (
            <div
              className="w-4 h-4 rounded-full shrink-0 border border-slate-300 dark:border-slate-600"
              style={{ backgroundColor: selectedColorHex }}
            />
          ) : (
            <Palette className="w-4 h-4 shrink-0" />
          )}
          <span className="truncate">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="w-56 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
      >
        {colorOptions.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4">
            {t ? t("filters.noColors") : "No colors available"}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {/* All Colors option */}
            <button
              onClick={() => onValueChange("all")}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                (!value || value === "all") && "bg-slate-100 dark:bg-slate-800"
              )}
            >
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                {(!value || value === "all") && (
                  <Check className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                )}
              </div>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">
                {t ? t("filters.all") : "All"}
              </span>
            </button>

            {/* Color options */}
            {colorOptions.map((color) => {
              const isSelected = value === color.value;

              return (
                <button
                  key={color.value}
                  onClick={() => onValueChange(color.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                    isSelected && "bg-slate-100 dark:bg-slate-800"
                  )}
                  title={t ? t(`colors.${color.value}`) : color.value}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110",
                      color.value === "white"
                        ? "border-slate-300 dark:border-slate-600"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={cn(
                          "w-3.5 h-3.5",
                          ["white", "yellow", "gold"].includes(color.value)
                            ? "text-slate-800"
                            : "text-white"
                        )}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate w-full text-center">
                    {t ? t(`colors.${color.value}`) : color.value}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
