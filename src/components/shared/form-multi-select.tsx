"use client"

import { Controller, Control } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "./multi-select"

interface Option {
  label: string
  value: string
}

interface FormMultiSelectProps {
  name: string
  control: Control<any>
  options: Option[]
  label?: string
  placeholder?: string
}

export function FormMultiSelect({
  name,
  control,
  options,
  label,
  placeholder,
}: FormMultiSelectProps) {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <MultiSelect
            options={options}
            selected={field.value || []}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        )}
      />
    </div>
  )
}
