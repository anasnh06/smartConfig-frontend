"use client"

import { useStore } from "@/lib/store"
import { useStepperStore } from "@/lib/store/stepper"
import { StepperGroupCard } from "./stepper-group-card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, PlayCircle } from "lucide-react"

interface Props {
  onLaunch: () => void
  isLaunching: boolean
}

export function StepperExecutionGroupsAndReview({ onLaunch, isLaunching }: Props) {
  const { openCreateExecutionGroupModal } = useStore()
  const {
    draftExecutionGroups,
    clearDraftGroups,
  } = useStepperStore()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Groupes d'exécution</h2>
        <div className="flex gap-2">
          <Button onClick={openCreateExecutionGroupModal}>
            + Ajouter un groupe
          </Button>
          <Button variant="outline" onClick={clearDraftGroups}>
            🗑️ Vider les groupes
          </Button>
        </div>
      </div>

      {draftExecutionGroups.length === 0 ? (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Aucun groupe ajouté</AlertTitle>
          <AlertDescription>
            Veuillez ajouter au moins un groupe avant de lancer l'exécution.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {draftExecutionGroups.map((group, index) => (
            <StepperGroupCard key={index} group={group} index={index} />
          ))}
        </div>
      )}

      <div className="text-right pt-4">
        <Button
          onClick={onLaunch}
          disabled={isLaunching || draftExecutionGroups.length === 0}
        >
          {isLaunching ? (
            "Lancement en cours..."
          ) : (
            <>
              <PlayCircle className="w-4 h-4 mr-2" />
              Lancer l'exécution
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
