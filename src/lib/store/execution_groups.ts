import { create } from "zustand"
import type { ExecutionGroup, CreateExecutionGroupData, UpdateExecutionGroupData } from "@/types/entities"
import {
  getExecutionGroups,
  createExecutionGroup,
  updateExecutionGroup,
  deleteExecutionGroup,
} from "@/lib/api/execution_group"

interface ExecutionGroupsStore {
  executionGroups: ExecutionGroup[]
  loading: boolean
  error: string | null

  fetchExecutionGroups: () => Promise<void>
  reloadExecutionGroups: () => Promise<void>
  addExecutionGroup: (data: CreateExecutionGroupData) => Promise<void>
  updateExecutionGroup: (id: number, data: UpdateExecutionGroupData) => Promise<void>
  removeExecutionGroup: (id: number) => Promise<void>
}

export const useExecutionGroupsStore = create<ExecutionGroupsStore>((set, get) => ({
  executionGroups: [],
  loading: false,
  error: null,

  fetchExecutionGroups: async () => {
    set({ loading: true, error: null })
    try {
      const executionGroups = await getExecutionGroups()
      set({ executionGroups })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadExecutionGroups: async () => {
    await get().fetchExecutionGroups()
  },

  addExecutionGroup: async (data) => {
    try {
      const newGroup = await createExecutionGroup(data)
      set({ executionGroups: [...get().executionGroups, newGroup] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateExecutionGroup: async (id, data) => {
    try {
      const updated = await updateExecutionGroup(id, data)
      set({
        executionGroups: get().executionGroups.map((group) =>
          group.id === id ? updated : group
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeExecutionGroup: async (id) => {
    try {
      await deleteExecutionGroup(id)
      set({
        executionGroups: get().executionGroups.filter((group) => group.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
