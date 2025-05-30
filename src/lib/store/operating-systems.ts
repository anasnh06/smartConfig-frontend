import { create } from "zustand"
import type { OperatingSystem } from "@/types/entities"
import {
  getOperatingSystems,
  createOperatingSystem,
  updateOperatingSystem,
  deleteOperatingSystem,
} from "@/lib/api/operating-system"

type OperatingSystemsStore = {
  operatingSystems: OperatingSystem[]
  loading: boolean
  error: string | null

  fetchOperatingSystems: () => Promise<void>
  reloadOperatingSystems: () => Promise<void>
  addOperatingSystem: (data: { name: string; version?: string }) => Promise<void>
  updateOperatingSystem: (id: number, data: { name?: string; version?: string }) => Promise<void>
  removeOperatingSystem: (id: number) => Promise<void>
}

export const useOperatingSystemsStore = create<OperatingSystemsStore>((set, get) => ({
  operatingSystems: [],
  loading: false,
  error: null,

  fetchOperatingSystems: async () => {
    set({ loading: true, error: null })
    try {
      const operatingSystems = await getOperatingSystems()
      set({ operatingSystems })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadOperatingSystems: async () => {
    await get().fetchOperatingSystems()
  },

  addOperatingSystem: async (data) => {
    try {
      const newOs = await createOperatingSystem(data)
      set({ operatingSystems: [...get().operatingSystems, newOs] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateOperatingSystem: async (id, data) => {
    try {
      const updated = await updateOperatingSystem(id, data)
      set({
        operatingSystems: get().operatingSystems.map((os) =>
          os.id === id ? updated : os
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeOperatingSystem: async (id) => {
    try {
      await deleteOperatingSystem(id)
      set({
        operatingSystems: get().operatingSystems.filter((os) => os.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
