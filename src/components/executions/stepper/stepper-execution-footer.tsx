"use client"

import { Button } from "@/components/ui/button"

interface StepperExecutionFooterProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
}

export function StepperExecutionFooter({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
}: StepperExecutionFooterProps) {
  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        Précédent
      </Button>

      {currentStep < totalSteps - 1 && (
        <Button
          onClick={onNext}
        >
          Suivant
        </Button>
      )}
    </div>
  )
}
