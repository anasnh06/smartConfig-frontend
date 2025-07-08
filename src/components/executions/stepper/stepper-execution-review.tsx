"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { useStepperStore } from "@/lib/store/stepper"
import { StepperGroupCard } from "./stepper-group-card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, PlayCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useExecutionRunnersStore } from "@/lib/store/execution_runners"

export function StepperExecutionReview() {
  const { selectedExecution, clearSelectedExecution } = useStore()
  const {
    draftExecutionGroups,
    clearDraftGroups,
    closeStepperExecutionModal,
  } = useStepperStore()

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const launchFullExecution = useExecutionRunnersStore((s) => s.launchFullExecution)

  if (draftExecutionGroups.length === 0) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Aucun groupe ajouté</AlertTitle>
        <AlertDescription>
          Veuillez ajouter au moins un groupe avant de lancer l'exécution.
        </AlertDescription>
      </Alert>
    )
  }

  const handleLaunchExecution = async () => {
    if (!selectedExecution?.title) {
      toast({
        title: "❌ Titre requis",
        description: "Veuillez définir un titre pour l'exécution avant le lancement.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        title: selectedExecution.title,
        groups: draftExecutionGroups.map((group, idx) => ({
          name: group.groupName?.trim() || `Groupe ${idx + 1}`,
          servers: group.servers.map((id) => ({ id })),
          elements: group.elements,
        })),
      }

      const execution = await launchFullExecution(payload)

      toast({
        title: "✅ Exécution lancée avec succès",
        description: `ID: ${execution.id}`,
      })

      clearDraftGroups()
      clearSelectedExecution()
      closeStepperExecutionModal()

      // 🚀 À intégrer ensuite :
      // openExecutionTrackingModal(execution.id);
      // startWebSocketTracking(execution.id);
    } catch (error: any) {
      toast({
        title: "❌ Échec du lancement",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Revue finale des groupes</h2>
        <Button variant="outline" onClick={clearDraftGroups}>
          Vider les groupes
        </Button>
      </div>

      <div className="space-y-3">
        {draftExecutionGroups.map((group, index) => (
          <StepperGroupCard key={index} group={group} index={index} />
        ))}
      </div>

      {/* <div className="flex justify-end pt-4">
        <Button
          onClick={handleLaunchExecution}
          disabled={isLoading}
          className="flex gap-2 items-center"
        >
          {isLoading ? (
            "Lancement en cours..."
          ) : (
            <>
              <PlayCircle className="h-5 w-5" />
              Lancer l'exécution
            </>
          )}
        </Button>
      </div> */}
    </div>
  )
}
