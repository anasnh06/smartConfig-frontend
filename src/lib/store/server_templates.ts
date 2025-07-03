import { create } from "zustand"
import type { ServerTemplate, CreateServerTemplateData, UpdateServerTemplateData } from "@/types/entities"
import {
  getServerTemplates,
  createServerTemplate,
  updateServerTemplate,
  deleteServerTemplate,
} from "@/lib/api/server_template"

interface ServerTemplatesStore {
  serverTemplates: ServerTemplate[]
  loading: boolean
  error: string | null

  fetchServerTemplates: () => Promise<void>
  reloadServerTemplates: () => Promise<void>
  addServerTemplate: (data: CreateServerTemplateData) => Promise<void>
  updateServerTemplate: (id: number, data: UpdateServerTemplateData) => Promise<void>
  removeServerTemplate: (id: number) => Promise<void>
}

export const useServerTemplatesStore = create<ServerTemplatesStore>((set, get) => ({
  serverTemplates: [],
  loading: false,
  error: null,

  fetchServerTemplates: async () => {
    set({ loading: true, error: null })
    try {
      const serverTemplates = await getServerTemplates()
      set({ serverTemplates })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadServerTemplates: async () => {
    await get().fetchServerTemplates()
  },

  addServerTemplate: async (data) => {
    try {
      const created = await createServerTemplate(data)
      set({ serverTemplates: [...get().serverTemplates, created] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateServerTemplate: async (id, data) => {
    try {
      const updated = await updateServerTemplate(id, data)
      set({
        serverTemplates: get().serverTemplates.map((t) => (t.id === id ? updated : t)),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeServerTemplate: async (id) => {
    try {
      await deleteServerTemplate(id)
      set({
        serverTemplates: get().serverTemplates.filter((t) => t.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
