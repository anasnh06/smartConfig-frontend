"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import * as Popover from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
}: MultiSelectProps) {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          <span className="truncate text-left w-full">
            {selected.length > 0
              ? options
                  .filter((opt) => selected.includes(opt.value))
                  .map((opt) => opt.label)
                  .join(", ")
              : <span className="text-muted-foreground">{placeholder}</span>}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Content
        className={cn(
          "z-50 mt-2 rounded-md border border-border bg-popover text-popover-foreground shadow-md",
          "max-h-48 overflow-y-auto p-1"
        )}
        align="start"
        sideOffset={4}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <div
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground",
                isSelected && "bg-muted text-muted-foreground"
              )}
            >
              <Check
                className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
              />
              {option.label}
            </div>
          )
        })}
      </Popover.Content>
    </Popover.Root>
  )
}
