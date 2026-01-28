import * as React from "react"
import { format } from "date-fns"
import { enUS, tr } from "date-fns/locale"
import { useTranslation } from "react-i18next"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const locales = {
  en: enUS,
  tr: tr,
}

export function DatePicker({ date, onDateChange, placeholder = "Pick a date", className }) {
  const { i18n } = useTranslation()
  const currentYear = new Date().getFullYear()
  const locale = locales[i18n.language] || enUS

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-8 justify-start text-left font-normal text-xs",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
          {date ? format(date, "PP", { locale }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={1950}
          toYear={currentYear}
          locale={locale}
          formatters={{
            formatMonthCaption: (month) => format(month, "LLL", { locale }),
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
