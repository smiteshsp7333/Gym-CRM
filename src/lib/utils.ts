import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse, isValid } from "date-fns"

if (typeof BigInt !== "undefined" && !(BigInt.prototype as any).toJSON) {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeWords = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const normalizeToDdMmYyyy = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    try {
      const parsed = parse(trimmed, "yyyy-MM-dd", new Date());
      if (isValid(parsed)) return format(parsed, "dd-MM-yyyy");
    } catch {}
  }
  try {
    const parsed = new Date(trimmed);
    if (isValid(parsed) && !isNaN(parsed.getTime())) return format(parsed, "dd-MM-yyyy");
  } catch {}
  return trimmed;
};