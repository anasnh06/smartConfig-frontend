"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StepGroupElementForm() {
  const { control, register, watch, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: "elements" })
  const elements = watch("elements") || []

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Éléments du groupe</h3>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border p-2 rounded-md">
          <div className="col-span-1">
            <Label>Type</Label>
            <Select
              value={elements[index]?.type || ""}
              onValueChange={(value) => setValue(`elements.${index}.type`, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="configuration">Configuration</SelectItem>
                <SelectItem value="manual">Manuelle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {elements[index]?.type === "manual" ? (
            <>
              <Input {...register(`elements.${index}.command`)} placeholder="Commande" className="col-span-1" />
              <Input {...register(`elements.${index}.name`)} placeholder="Nom (optionnel)" className="col-span-1" />
              <Input {...register(`elements.${index}.description`)} placeholder="Description (optionnelle)" className="col-span-1" />
            </>
          ) : (
            <Input
              type="number"
              {...register(`elements.${index}.id`, { valueAsNumber: true })}
              placeholder={elements[index]?.type === "template" ? "ID Template" : "ID Configuration"}
              className="col-span-2"
            />
          )}

          <Input
            type="number"
            {...register(`elements.${index}.order`, { valueAsNumber: true })}
            placeholder="Ordre (optionnel)"
            className="col-span-1"
          />

          <Button type="button" variant="outline" onClick={() => remove(index)} className="col-span-1">
            Supprimer
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Button type="button" onClick={() => append({ type: "template" })} variant="secondary">
          + Template
        </Button>
        <Button type="button" onClick={() => append({ type: "configuration" })} variant="secondary">
          + Configuration
        </Button>
        <Button type="button" onClick={() => append({ type: "manual", command: "" })} variant="secondary">
          + Commande manuelle
        </Button>
      </div>
    </div>
  )
}
