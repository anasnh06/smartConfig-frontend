"use client"

import { useState } from "react"
import { useStepperStore } from "@/lib/store/stepper"
import { useStore } from "@/lib/store"
import { useExecutionRunnersStore } from "@/lib/store/execution_runners"
import { useToast } from "@/components/ui/use-toast"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { StepperExecutionHeader } from "./stepper-execution-header"
import { StepperExecutionGroups } from "./stepper-execution-groups"
import { StepperExecutionReview } from "./stepper-execution-review"
import { StepperExecutionFooter } from "./stepper-execution-footer"
import { CreateStepperGroupModal } from "./create-stepper-group-modal"
import { EditStepperGroupModal } from "./edit-stepper-group-modal"

export function StepperExecutionModal() {
  const { isStepperExecutionModalOpen, closeStepperExecutionModal, draftExecutionGroups, clearDraftGroups } = useStepperStore()
  const { selectedExecution, clearSelectedExecution } = useStore()
  const { toast } = useToast()
  const launchFullExecution = useExecutionRunnersStore((s) => s.launchFullExecution)

  const [step, setStep] = useState(0)
  const [isLaunching, setIsLaunching] = useState(false)

  const next = () => setStep((s) => Math.min(s + 1, 2))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handleLaunchExecution = async () => {
    if (!selectedExecution?.title) {
      toast({
        title: "❌ Titre requis",
        description: "Veuillez définir un titre pour l'exécution avant le lancement.",
        variant: "destructive",
      })
      return
    }

    if (draftExecutionGroups.length === 0) {
      toast({
        title: "❌ Aucun groupe ajouté",
        description: "Ajoutez au moins un groupe avant de lancer l'exécution.",
        variant: "destructive",
      })
      return
    }

    setIsLaunching(true)
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

      // 🚀 Intégration WebSocket de suivi ici plus tard si souhaité
    } catch (error: any) {
      toast({
        title: "❌ Échec du lancement",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      })
    } finally {
      setIsLaunching(false)
    }
  }

  return (
    <Dialog open={isStepperExecutionModalOpen} onOpenChange={closeStepperExecutionModal}>
      <DialogContent className="max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="space-y-6">
          {step === 0 && <StepperExecutionHeader />}
          {step === 1 && <StepperExecutionGroups />}
          {step === 2 && <StepperExecutionReview />}

          <StepperExecutionFooter
            currentStep={step}
            totalSteps={3}
            onNext={next}
            onPrevious={back}
            onLaunch={handleLaunchExecution} // ✅ correction
            isNextDisabled={false}
            isLaunching={isLaunching}
          />

        </div>

        {/* Modales internes de création/édition */}
        <CreateStepperGroupModal />
        <EditStepperGroupModal />
      </DialogContent>
    </Dialog>
  )
}
