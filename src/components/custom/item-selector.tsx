"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "../ui/input"

interface Props {
  data: any[]
  onSelect: (value: string) => void
  valueKey: string
  labelKey: string
  defaultValue?: string
  placeholder?: string
  searchPlaceholder?: string
  onSelectGetRow?: (row: any) => void
}

export default function ItemSelector({
  data,
  onSelect,
  valueKey,
  labelKey,
  defaultValue = "",
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  onSelectGetRow
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
      const found = data.find((row) => row[valueKey] === defaultValue)
      if (found && onSelectGetRow) {
        onSelectGetRow(found)
      }
    }
  }, [defaultValue, data, valueKey])

  const filteredData = React.useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase().trim();
    return data.filter((row) => {
      const labelMatch = (row[labelKey] || "").toString().toLowerCase().includes(query);
      const phoneMatch = (row.phone || "").toString().includes(query);
      const codeMatch = (row.memberCode || "").toString().toLowerCase().includes(query);
      const descMatch = (row.description || "").toString().toLowerCase().includes(query);
      return labelMatch || phoneMatch || codeMatch || descMatch;
    });
  }, [data, search, labelKey]);

  const handleSelect = (currentValue: string, row: any) => {
    setValue(currentValue === value ? "" : currentValue)
    onSelect(currentValue)
    if (onSelectGetRow) {
      onSelectGetRow(row)
    }
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) setSearch("")
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between flex-1 text-left font-normal bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-100"
        >
          {value
            ? data.find((row) => row[valueKey] === value)?.[labelKey] || placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-zinc-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[320px] p-0 bg-[#12141c] border-zinc-800 shadow-2xl" align="start">
        <div className="flex flex-col p-2 space-y-2">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            autoFocus
          />
          <div className="max-h-[220px] overflow-y-auto space-y-1">
            {filteredData.length === 0 && (
              <div className="px-3 py-3 text-xs text-zinc-400 text-center">
                No matching results found.
              </div>
            )}
            {filteredData.map((row) => (
              <button
                type="button"
                key={row[valueKey]}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-left hover:bg-zinc-800/80 transition-colors cursor-pointer",
                  value === row[valueKey] && "bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00]"
                )}
                onClick={() => handleSelect(row[valueKey], row)}
              >
                <div className="flex items-center gap-2">
                  <Check
                    className={cn(
                      "h-3.5 w-3.5",
                      value === row[valueKey] ? "opacity-100 text-[#ccff00]" : "opacity-0"
                    )}
                  />
                  <div>
                    <p className="font-semibold text-zinc-100">{row[labelKey]}</p>
                    {(row.phone || row.memberCode) && (
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {row.memberCode ? `${row.memberCode} • ` : ""}{row.phone ? `+91 ${row.phone}` : ""}
                      </p>
                    )}
                  </div>
                </div>
                {row.price && (
                  <span className="text-[11px] font-bold text-[#ccff00] tabular-nums">
                    ₹{row.price.toLocaleString("en-IN")}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
