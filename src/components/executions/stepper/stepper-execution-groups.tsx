"use client"

import { useStore } from "@/lib/store"
import { useStepperStore } from "@/lib/store/stepper"
import { Button } from "@/components/ui/button"
import { StepperGroupCard } from "./stepper-group-card"

export function StepperExecutionGroups() {
  const { openCreateExecutionGroupModal } = useStore()
  const { draftExecutionGroups } = useStepperStore()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Groupes d'exécution</h2>
        <Button onClick={openCreateExecutionGroupModal}>
          + Ajouter un groupe
        </Button>
      </div>

      {draftExecutionGroups.length === 0 ? (
        <p className="text-muted-foreground">Aucun groupe ajouté pour l'instant.</p>
      ) : (
        <div
          className="space-y-4 max-h-96 overflow-y-auto pr-2"
          style={{ scrollbarGutter: "stable" }}
        >
          {draftExecutionGroups.map((group, index) => (
            <StepperGroupCard
              key={index}
              group={group}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
