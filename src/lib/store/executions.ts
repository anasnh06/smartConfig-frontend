import { create } from "zustand"
import type { Execution, CreateExecutionData, UpdateExecutionData } from "@/types/entities"
import {
  getExecutions,
  createExecution,
  updateExecution,
  deleteExecution,
} from "@/lib/api/execution"

interface ExecutionsStore {
  executions: Execution[]
  loading: boolean
  error: string | null

  fetchExecutions: () => Promise<void>
  reloadExecutions: () => Promise<void>
  addExecution: (data: CreateExecutionData) => Promise<void>
  updateExecution: (id: number, data: UpdateExecutionData) => Promise<void>
  removeExecution: (id: number) => Promise<void>
}

export const useExecutionsStore = create<ExecutionsStore>((set, get) => ({
  executions: [],
  loading: false,
  error: null,

  fetchExecutions: async () => {
    set({ loading: true, error: null })
    try {
      const executions = await getExecutions()
      set({ executions })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadExecutions: async () => {
    await get().fetchExecutions()
  },

  addExecution: async (data) => {
    try {
      const newExecution = await createExecution(data)
      set({ executions: [...get().executions, newExecution] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateExecution: async (id, data) => {
    try {
      const updated = await updateExecution(id, data)
      set({
        executions: get().executions.map((exe) =>
          exe.id === id ? updated : exe
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeExecution: async (id) => {
    try {
      await deleteExecution(id)
      set({
        executions: get().executions.filter((exe) => exe.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
