"use client"

import { useStore } from "@/lib/store"
import { StepperGroupCard } from "./stepper-group-card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function StepperExecutionReview() {
  const { draftExecutionGroups, clearDraftGroups, openStepperExecutionModal } = useStore()

  if (draftExecutionGroups.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Aucun groupe ajouté</AlertTitle>
        <AlertDescription>
          Veuillez ajouter au moins un groupe avant de lancer l'exécution.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Revue finale des groupes</h2>
        <Button variant="destructive" onClick={clearDraftGroups}>
          Vider tous les groupes
        </Button>
      </div>

      <div className="space-y-2">
        {draftExecutionGroups.map((group, index) => (
          <StepperGroupCard key={index} group={group} index={index} />
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={openStepperExecutionModal}>Lancer l'exécution</Button>
      </div>
    </div>
  )
}
