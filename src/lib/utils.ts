import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

