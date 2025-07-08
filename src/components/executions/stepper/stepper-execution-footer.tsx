"use client"

import { PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepperExecutionFooterProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onLaunch: () => void
  isNextDisabled?: boolean
  isLaunching?: boolean
}

export function StepperExecutionFooter({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onLaunch,
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
        <Button
          onClick={onNext}
          disabled={isNextDisabled || isLaunching}
        >
          Suivant
        </Button>
      ) : (
        <Button
          onClick={onLaunch}
          disabled={isNextDisabled || isLaunching}
          className="flex gap-2 items-center"
        >
          {isLaunching ? (
            "Lancement en cours..."
          ) : (
            <>
              <PlayCircle className="h-5 w-5" />
              Lancer l'exécution
            </>
          )}
        </Button>
      )}
    </div>
  )
}
