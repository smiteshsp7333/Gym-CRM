"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerDemoProps {
  defaultDate?: string // Format: "dd-MM-yyyy" or "yyyy-MM-dd" or ISO
  onDateChange?: (date: string) => void
}

function parseSafeDate(input?: string): Date | undefined {
  if (!input || typeof input !== "string" || !input.trim()) return undefined;
  const trimmed = input.trim();

  // Try dd-MM-yyyy format (e.g., 21-10-2026)
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(trimmed)) {
    try {
      const parsed = parse(trimmed, "dd-MM-yyyy", new Date());
      if (isValid(parsed) && !isNaN(parsed.getTime())) return parsed;
    } catch {}
  }

  // Try yyyy-MM-dd format (e.g., 2026-10-21)
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    try {
      const parsed = parse(trimmed, "yyyy-MM-dd", new Date());
      if (isValid(parsed) && !isNaN(parsed.getTime())) return parsed;
    } catch {}
  }

  // Try standard Date parsing (e.g., ISO string)
  try {
    const parsed = new Date(trimmed);
    if (isValid(parsed) && !isNaN(parsed.getTime())) return parsed;
  } catch {}

  return undefined;
}

export function DatePickerDemo({ defaultDate, onDateChange }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => parseSafeDate(defaultDate));

  const [month, setMonth] = React.useState<number>(() => {
    const initial = parseSafeDate(defaultDate);
    return initial ? initial.getMonth() : new Date().getMonth();
  });

  const [year, setYear] = React.useState<number>(() => {
    const initial = parseSafeDate(defaultDate);
    return initial ? initial.getFullYear() : new Date().getFullYear();
  });

  // Keep in sync when defaultDate prop changes externally
  React.useEffect(() => {
    const parsed = parseSafeDate(defaultDate);
    if (parsed) {
      setDate(parsed);
      setMonth(parsed.getMonth());
      setYear(parsed.getFullYear());
    }
  }, [defaultDate]);

  // Generate arrays for month and year options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2023, i), "MMMM"),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => {
    const y = currentYear - 90 + i;
    return { value: y, label: y.toString() };
  });

  // Handle date selection
  const handleDateChange = (selectedDate?: Date) => {
    if (!selectedDate || isNaN(selectedDate.getTime())) return;
    setDate(selectedDate);
    setMonth(selectedDate.getMonth());
    setYear(selectedDate.getFullYear());
    if (onDateChange) {
      onDateChange(format(selectedDate, "dd-MM-yyyy"));
    }
  };

  // Handle month dropdown changes
  const handleMonthChange = (val: string) => {
    const newMonth = parseInt(val, 10);
    setMonth(newMonth);
    const baseDate = date || new Date();
    const newDate = new Date(year, newMonth, Math.min(baseDate.getDate(), 28));
    setDate(newDate);
    if (onDateChange) {
      onDateChange(format(newDate, "dd-MM-yyyy"));
    }
  };

  // Handle year dropdown changes
  const handleYearChange = (val: string) => {
    const newYear = parseInt(val, 10);
    setYear(newYear);
    const baseDate = date || new Date();
    const newDate = new Date(newYear, month, Math.min(baseDate.getDate(), 28));
    setDate(newDate);
    if (onDateChange) {
      onDateChange(format(newDate, "dd-MM-yyyy"));
    }
  };

  const isDateValid = date instanceof Date && isValid(date) && !isNaN(date.getTime());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:bg-zinc-800 hover:text-white h-12 rounded-xl text-sm",
            !isDateValid && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#ccff00]" />
          {isDateValid ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl z-50" align="start">
        <div className="flex space-x-2 p-2 border-b border-zinc-800">
          <Select
            onValueChange={handleMonthChange}
            value={month.toString()}
          >
            <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800 text-zinc-200">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200 max-h-56">
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()} className="focus:bg-[#ccff00] focus:text-black">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={year.toString()}
          >
            <SelectTrigger className="w-[100px] bg-zinc-900 border-zinc-800 text-zinc-200">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200 max-h-56">
              {years.map((y) => (
                <SelectItem key={y.value} value={y.value.toString()} className="focus:bg-[#ccff00] focus:text-black">
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={isDateValid ? date : undefined}
          onSelect={handleDateChange}
          month={new Date(year, month)}
          onMonthChange={(newMonth) => {
            setMonth(newMonth.getMonth());
            setYear(newMonth.getFullYear());
          }}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}