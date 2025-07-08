"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ExecutionElement {
  type: "template" | "configuration" | "manual"
  id?: number
  command?: string
  name?: string
  description?: string
  order?: number
}

export interface ExecutionGroupDraft {
  servers: number[]
  elements: ExecutionElement[]
  groupName?: string
}

interface StepperState {
  draftExecutionGroups: ExecutionGroupDraft[]
  isStepperExecutionModalOpen: boolean
  isEditExecutionGroupModalOpen: boolean // ✅ ajouté
  selectedDraftGroupIndex: number | null
}

interface StepperActions {
  openStepperExecutionModal: () => void
  closeStepperExecutionModal: () => void
  addDraftGroup: (group: ExecutionGroupDraft) => void
  removeDraftGroup: (index: number) => void
  updateDraftGroup: (index: number, group: ExecutionGroupDraft) => void
  clearDraftGroups: () => void
  setSelectedDraftGroupIndex: (index: number | null) => void
  setIsEditExecutionGroupModalOpen: (isOpen: boolean) => void // ✅ ajouté
}

type StepperStore = StepperState & StepperActions

export const useStepperStore = create<StepperStore>()(
  persist(
    (set) => ({
      draftExecutionGroups: [],
      isStepperExecutionModalOpen: false,
      isEditExecutionGroupModalOpen: false, // ✅ initialisé
      selectedDraftGroupIndex: null,

      openStepperExecutionModal: () => set({ isStepperExecutionModalOpen: true }),
      closeStepperExecutionModal: () => set({ isStepperExecutionModalOpen: false }),

      addDraftGroup: (group) =>
        set((state) => ({
          draftExecutionGroups: [...state.draftExecutionGroups, group],
        })),

      removeDraftGroup: (index) =>
        set((state) => ({
          draftExecutionGroups: state.draftExecutionGroups.filter((_, i) => i !== index),
        })),

      updateDraftGroup: (index, group) =>
        set((state) => {
          const updatedGroups = [...state.draftExecutionGroups]
          updatedGroups[index] = group
          return { draftExecutionGroups: updatedGroups }
        }),

      clearDraftGroups: () => set({ draftExecutionGroups: [] }),

      setSelectedDraftGroupIndex: (index) => set({ selectedDraftGroupIndex: index }),

      setIsEditExecutionGroupModalOpen: (isOpen) => set({ isEditExecutionGroupModalOpen: isOpen }), // ✅
    }),
    {
      name: "smartconfig-stepper",
    }
  )
)
