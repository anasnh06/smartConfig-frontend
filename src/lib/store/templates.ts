import { create } from "zustand"
import type { Template, CreateTemplateData, UpdateTemplateData } from "@/types/entities"
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/lib/api/template"

interface TemplatesStore {
  templates: Template[]
  loading: boolean
  error: string | null

  fetchTemplates: () => Promise<void>
  reloadTemplates: () => Promise<void>
  addTemplate: (data: CreateTemplateData) => Promise<void>
  updateTemplate: (id: number, data: UpdateTemplateData) => Promise<void>
  removeTemplate: (id: number) => Promise<void>
}

export const useTemplatesStore = create<TemplatesStore>((set, get) => ({
  templates: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null })
    try {
      const templates = await getTemplates()
      set({ templates })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadTemplates: async () => {
    await get().fetchTemplates()
  },

  addTemplate: async (data) => {
    try {
      const newTemplate = await createTemplate(data)
      set({ templates: [...get().templates, newTemplate] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateTemplate: async (id, data) => {
    try {
      const updated = await updateTemplate(id, data)
      set({
        templates: get().templates.map((t) =>
          t.id === id ? updated : t
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeTemplate: async (id) => {
    try {
      await deleteTemplate(id)
      set({
        templates: get().templates.filter((t) => t.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
