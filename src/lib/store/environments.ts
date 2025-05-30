import { create } from "zustand"
import type { Environment } from "@/types/entities"
import {
  getEnvironments,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
} from "@/lib/api/environment"

type EnvironmentsStore = {
  environments: Environment[]
  loading: boolean
  error: string | null

  fetchEnvironments: () => Promise<void>
  reloadEnvironments: () => Promise<void>
  addEnvironment: (data: { name: string }) => Promise<void>
  updateEnvironment: (id: number, data: { name: string }) => Promise<void>
  removeEnvironment: (id: number) => Promise<void>
}

export const useEnvironmentsStore = create<EnvironmentsStore>((set, get) => ({
  environments: [],
  loading: false,
  error: null,

  fetchEnvironments: async () => {
    set({ loading: true, error: null })
    try {
      const environments = await getEnvironments()
      set({ environments })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadEnvironments: async () => {
    await get().fetchEnvironments()
  },

  addEnvironment: async (data) => {
    try {
      const newEnv = await createEnvironment(data)
      set({ environments: [...get().environments, newEnv] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateEnvironment: async (id, data) => {
    try {
      const updated = await updateEnvironment(id, data)
      set({
        environments: get().environments.map((env) =>
          env.id === id ? updated : env
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeEnvironment: async (id) => {
    try {
      await deleteEnvironment(id)
      set({
        environments: get().environments.filter((env) => env.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
