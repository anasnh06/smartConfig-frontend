"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { StepperExecutionHeader } from "./stepper-execution-header"
import { StepperExecutionGroups } from "./stepper-execution-groups"
import { StepperExecutionReview } from "./stepper-execution-review"
import { StepperExecutionFooter } from "./stepper-execution-footer"

export function StepperExecutionModal() {
  const { isStepperExecutionModalOpen, closeStepperExecutionModal } = useStore()
  const [step, setStep] = useState(0)
  const [isLaunching, setIsLaunching] = useState(false)

  const next = () => setStep((s) => Math.min(s + 1, 2))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const goTo = (index: number) => setStep(index)

  return (
    <Dialog open={isStepperExecutionModalOpen} onOpenChange={closeStepperExecutionModal}>
      <DialogContent className="max-w-4xl w-full">
        <div className="space-y-6">
          {step === 0 && <StepperExecutionHeader />}
          {step === 1 && <StepperExecutionGroups onEditGroup={goTo} />}
          {step === 2 && <StepperExecutionReview />}
          <StepperExecutionFooter
            currentStep={step}
            totalSteps={3}
            onNext={next}
            onPrevious={back}
            isNextDisabled={false} // ou validation dynamique
            isLaunching={isLaunching} // selon ton état local
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
