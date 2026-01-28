import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, CalendarDays, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import { motion, AnimatePresence } from "motion/react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AnimatedCheckbox } from "@/components/ui/animated-checkbox";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";

const locales = {
  en: enUS,
  tr: tr,
};

// Animated Date Range Popover Component
function DateRangePopover({ dateFromObj, dateToObj, onDateFromChange, onDateToChange }) {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const locale = locales[i18n.language] || enUS;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button className="w-full flex items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-sm transition-colors border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
            <span className={cn(
              "text-slate-600 dark:text-slate-400",
              (dateFromObj || dateToObj) && "text-slate-900 dark:text-slate-100 font-medium"
            )}>
              {dateFromObj && dateToObj
                ? `${format(dateFromObj, "MMM d, yyyy")} - ${format(dateToObj, "MMM d, yyyy")}`
                : dateFromObj
                ? `From ${format(dateFromObj, "MMM d, yyyy")}`
                : dateToObj
                ? `Until ${format(dateToObj, "MMM d, yyyy")}`
                : "Select date range"}
            </span>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </motion.div>
        </button>
      </PopoverPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              asChild
              side="bottom"
              align="start"
              sideOffset={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => {
                // Prevent closing when clicking inside Select dropdown
                if (e.target?.closest('[role="listbox"]') || e.target?.closest('[data-radix-select-viewport]')) {
                  e.preventDefault();
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.8
                }}
                className="z-[100] w-auto p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg"
              >
                <Calendar
                  mode="range"
                  selected={{
                    from: dateFromObj,
                    to: dateToObj,
                  }}
                  onSelect={(range) => {
                    onDateFromChange(range?.from);
                    onDateToChange(range?.to);
                  }}
                  numberOfMonths={1}
                  className="p-3"
                  captionLayout="dropdown-buttons"
                  fromYear={1950}
                  toYear={currentYear}
                  locale={locale}
                  formatters={{
                    formatMonthCaption: (month) => format(month, "LLL", { locale }),
                  }}
                />
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
}

export function MoreFiltersPopover({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const { t } = useTranslation();
  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.signed ||
    filters.matchWorn ||
    filters.playerIssue;

  const handleClearAdvancedFilters = () => {
    onFilterChange("dateFrom", undefined);
    onFilterChange("dateTo", undefined);
    onFilterChange("signed", undefined);
    onFilterChange("matchWorn", undefined);
    onFilterChange("playerIssue", undefined);
  };

  const dateFromObj = filters.dateFrom ? new Date(filters.dateFrom + "T12:00:00") : undefined;
  const dateToObj = filters.dateTo ? new Date(filters.dateTo + "T12:00:00") : undefined;

  const handleDateFromChange = (date) => {
    if (!date) {
      onFilterChange("dateFrom", undefined);
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    onFilterChange("dateFrom", `${year}-${month}-${day}`);
  };

  const handleDateToChange = (date) => {
    if (!date) {
      onFilterChange("dateTo", undefined);
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    onFilterChange("dateTo", `${year}-${month}-${day}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 text-sm gap-1.5",
            hasActiveFilters && "border-blue-500 bg-blue-50 dark:bg-blue-950"
          )}
        >
          <MoreHorizontal className="w-4 h-4 shrink-0" />
          <span>{t("filters.more")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="w-80 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
      >
        <div className="space-y-4">
          {/* Date Range */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              {t("filters.purchaseDateRange")}
            </Label>
            <DateRangePopover
              dateFromObj={dateFromObj}
              dateToObj={dateToObj}
              onDateFromChange={handleDateFromChange}
              onDateToChange={handleDateToChange}
            />
          </div>

          {/* Quick Filters */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              {t("filters.specialFeatures")}
            </Label>
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2.5">
                <AnimatedCheckbox
                  id="more-filter-signed"
                  checked={filters.signed === "true"}
                  onCheckedChange={(checked) =>
                    onFilterChange("signed", checked ? "true" : undefined)
                  }
                />
                <Label htmlFor="more-filter-signed" className="text-sm cursor-pointer">
                  {t("addShirt.signed")}
                </Label>
              </div>
              <div className="flex items-center space-x-2.5">
                <AnimatedCheckbox
                  id="more-filter-matchWorn"
                  checked={filters.matchWorn === "true"}
                  onCheckedChange={(checked) =>
                    onFilterChange("matchWorn", checked ? "true" : undefined)
                  }
                />
                <Label htmlFor="more-filter-matchWorn" className="text-sm cursor-pointer">
                  {t("addShirt.matchWorn")}
                </Label>
              </div>
              <div className="flex items-center space-x-2.5">
                <AnimatedCheckbox
                  id="more-filter-playerIssue"
                  checked={filters.playerIssue === "true"}
                  onCheckedChange={(checked) =>
                    onFilterChange("playerIssue", checked ? "true" : undefined)
                  }
                />
                <Label htmlFor="more-filter-playerIssue" className="text-sm cursor-pointer">
                  {t("addShirt.playerIssue")}
                </Label>
              </div>
            </div>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAdvancedFilters}
              className="w-full h-9 text-sm"
            >
              {t("filters.clearAdvanced")}
            </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
