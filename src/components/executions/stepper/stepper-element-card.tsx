"use client"

import type { ExecutionElement } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StepperElementCardProps {
  element: ExecutionElement
  index?: number
}

export function StepperElementCard({ element, index }: StepperElementCardProps) {
  const typeColor = {
    template: "bg-blue-100 text-blue-800",
    configuration: "bg-green-100 text-green-800",
    manual: "bg-yellow-100 text-yellow-800",
  }[element.type]

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-1 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {index !== undefined && (
              <span className="text-xs text-muted-foreground">#{index + 1}</span>
            )}
            <Badge className={cn("text-xs", typeColor)}>
              {element.type.toUpperCase()}
            </Badge>
          </div>
          {element.order !== undefined && (
            <span className="text-xs text-muted-foreground">Ordre: {element.order}</span>
          )}
        </div>

        {element.type === "manual" ? (
          <div className="text-sm">
            <p className="font-medium">Commande:</p>
            <p className="truncate text-muted-foreground">{element.command}</p>
            {element.name && (
              <p className="truncate text-muted-foreground text-xs">Nom: {element.name}</p>
            )}
            {element.description && (
              <p className="truncate text-muted-foreground text-xs">Description: {element.description}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            ID associé: {element.id ?? "Non spécifié"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
