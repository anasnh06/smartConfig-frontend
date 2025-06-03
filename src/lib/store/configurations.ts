import { create } from "zustand"
import type { Configuration } from "@/types/entities"
import {
  getConfigurations,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
} from "@/lib/api/configuration"

interface ConfigurationsStore {
  configurations: Configuration[]
  loading: boolean
  error: string | null

  fetchConfigurations: () => Promise<void>
  reloadConfigurations: () => Promise<void>
  addConfiguration: (data: {
    name: string
    command: string
    description?: string
    operating_system_ids: number[]
  }) => Promise<void>
  updateConfiguration: (id: number, data: Partial<{
    name: string
    command: string
    description?: string
    operating_system_ids: number[]
  }>) => Promise<void>
  removeConfiguration: (id: number) => Promise<void>
}

export const useConfigurationsStore = create<ConfigurationsStore>((set, get) => ({
  configurations: [],
  loading: false,
  error: null,

  fetchConfigurations: async () => {
    set({ loading: true, error: null })
    try {
      const configurations = await getConfigurations()
      set({ configurations })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadConfigurations: async () => {
    await get().fetchConfigurations()
  },

  addConfiguration: async (data) => {
    try {
      const newConfig = await createConfiguration(data)
      set({ configurations: [...get().configurations, newConfig] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateConfiguration: async (id, data) => {
    try {
      const updated = await updateConfiguration(id, data)
      set({
        configurations: get().configurations.map((config) =>
          config.id === id ? updated : config
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeConfiguration: async (id) => {
    try {
      await deleteConfiguration(id)
      set({
        configurations: get().configurations.filter((config) => config.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
