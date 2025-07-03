import { create } from "zustand"
import type { Execution } from "@/types/entities"
import {
  launchExecutionAsync,
  launchExecutionCelery,
  launchGroupAsync,
  launchGroupCelery,
  replayExecution,
  replayGroup,
  replayServerTemplate,
  replayServerConfiguration,
  getExecutionStatus,
  getGroupStatus,
  launchFullExecution,
} from "@/lib/api/execution_runner"

interface ExecutionRunnersStore {
  executions: Execution[]
  loading: boolean
  error: string | null

  addExecution: (execution: Execution) => void
  fetchExecutionStatus: (id: number) => Promise<void>
  fetchGroupStatus: (id: number) => Promise<void>

  launchExecutionAsync: (id: number) => Promise<void>
  launchExecutionCelery: (id: number) => Promise<void>
  launchGroupAsync: (id: number) => Promise<void>
  launchGroupCelery: (id: number) => Promise<void>
  launchFullExecution: (
    data: Parameters<typeof launchFullExecution>[0]
  ) => Promise<Execution>

  replayExecution: (id: number) => Promise<Execution>
  replayGroup: (id: number) => Promise<Execution>
  replayServerTemplate: (id: number) => Promise<Execution>
  replayServerConfiguration: (id: number) => Promise<Execution>
}

export const useExecutionRunnersStore = create<ExecutionRunnersStore>((set, get) => ({
  executions: [],
  loading: false,
  error: null,

  addExecution: (execution) => {
    set({ executions: [...get().executions, execution] })
  },

  fetchExecutionStatus: async (id) => {
    try {
      set({ loading: true })
      const updated = await getExecutionStatus(id)
      set({
        executions: get().executions.map((e) =>
          e.id === id
            ? {
                ...e,
                status: updated.status,
                started_at: updated.started_at ?? undefined, // Fix: never null, only string|undefined
                finished_at: updated.finished_at ?? undefined, // Fix: never null, only string|undefined
              }
            : e
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  fetchGroupStatus: async (id) => {
    try {
      await getGroupStatus(id)
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  launchExecutionAsync: async (id) => {
    try {
      await launchExecutionAsync(id)
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  launchExecutionCelery: async (id) => {
    try {
      await launchExecutionCelery(id)
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  launchGroupAsync: async (id) => {
    try {
      await launchGroupAsync(id)
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  launchGroupCelery: async (id) => {
    try {
      await launchGroupCelery(id)
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  replayExecution: async (id) => {
    try {
      const exec = await replayExecution(id)
      get().addExecution(exec)
      return exec
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  replayGroup: async (id) => {
    try {
      const exec = await replayGroup(id)
      get().addExecution(exec)
      return exec
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  replayServerTemplate: async (id) => {
    try {
      const exec = await replayServerTemplate(id)
      get().addExecution(exec)
      return exec
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  replayServerConfiguration: async (id) => {
    try {
      const exec = await replayServerConfiguration(id)
      get().addExecution(exec)
      return exec
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },
  launchFullExecution: async (data) => {
  try {
    const execution = await launchFullExecution(data)
    get().addExecution(execution)
    return execution
  } catch (error: any) {
    set({ error: error.message })
    throw error
  }
},
}))
