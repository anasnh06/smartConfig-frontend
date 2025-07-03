"use client"

import { Button } from "@/components/ui/button"

interface StepperExecutionFooterProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  isNextDisabled?: boolean
  isLaunching?: boolean
}

export function StepperExecutionFooter({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled = false,
  isLaunching = false,
}: StepperExecutionFooterProps) {
  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={currentStep === 0 || isLaunching}
      >
        Précédent
      </Button>

      {currentStep < totalSteps - 1 ? (
        <Button onClick={onNext} disabled={isNextDisabled || isLaunching}>
          Suivant
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isNextDisabled || isLaunching}
        >
          {isLaunching ? "Lancement..." : "Lancer l'exécution"}
        </Button>
      )}
    </div>
  )
}
