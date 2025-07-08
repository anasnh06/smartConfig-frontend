"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"

export function StepperExecutionHeader() {
  const { selectedExecution, setSelectedExecution } = useStore()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Définir les informations de l'exécution</h2>
      <div className="space-y-2">
        <Label htmlFor="execution-title">Titre de l'exécution</Label>
        <Input
          id="execution-title"
          placeholder="Ex: Déploiement cluster QA"
          autoFocus
          value={selectedExecution?.title ?? ""}
          onChange={(e) =>
            setSelectedExecution({
              ...(selectedExecution ?? {}),
              title: e.target.value,
            })
          }
        />
      </div>
    </div>
  )
}
