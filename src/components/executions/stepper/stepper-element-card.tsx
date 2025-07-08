"use client"

import type { ExecutionElement } from "@/lib/store/stepper"
import { useTemplatesStore } from "@/lib/store/templates"
import { useConfigurationsStore } from "@/lib/store/configurations"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StepperElementCardProps {
  element: ExecutionElement
  index?: number
}

export function StepperElementCard({ element, index }: StepperElementCardProps) {
  const { templates } = useTemplatesStore()
  const { configurations } = useConfigurationsStore()

  const typeColor = {
    template: "bg-blue-100 text-blue-800",
    configuration: "bg-green-100 text-green-800",
    manual: "bg-yellow-100 text-yellow-800",
  }[element.type]

  // Récupération des infos détaillées si besoin
  const template =
    element.type === "template" && element.id
      ? templates.find((t) => t.id === element.id)
      : undefined

  const configuration =
    element.type === "configuration" && element.id
      ? configurations.find((c) => c.id === element.id)
      : undefined

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-1 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {index !== undefined && (
              <span className="text-xs text-muted-foreground">#{index + 1}</span>
            )}
            <Badge variant="secondary" className={cn("text-xs", typeColor)}>
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
        ) : element.type === "template" && template ? (
          <div className="text-sm space-y-1">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-semibold">Template:</span>
              <span className="text-primary">{template.name}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                ID: {template.id}
              </span>
              {template.role?.name && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  Rôle: {template.role.name}
                </span>
              )}
              {template.operating_systems?.length > 0 && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  OS: {template.operating_systems.map(os => os.name).join(", ")}
                </span>
              )}
            </div>
            {template.description && (
              <div className="text-xs text-muted-foreground">Description: {template.description}</div>
            )}
          </div>
        ) : element.type === "configuration" && configuration ? (
          <div className="text-sm space-y-1">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-semibold">Configuration:</span>
              <span className="text-primary">{configuration.name}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                ID: {configuration.id}
              </span>
              {configuration.operating_systems?.length > 0 && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  OS: {configuration.operating_systems.map(os => os.name).join(", ")}
                </span>
              )}
            </div>
            {configuration.description && (
              <div className="text-xs text-muted-foreground">Description: {configuration.description}</div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {element.type === "template" ? "ID Template" : "ID Configuration"} : {element.id ?? "Non spécifié"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
