"use client"

import { Button } from "@/components/ui/button"
import { Column } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

interface DataTableColumnHeaderProps<TData> {
  column: Column<TData>
  title: string
}

export function DataTableColumnHeader<TData>({
  column,
  title,
}: DataTableColumnHeaderProps<TData>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span>{title}</span>
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}
