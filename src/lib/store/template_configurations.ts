import { create } from "zustand"
import type {
  TemplateConfiguration,
  TemplateConfigurationCreate,
  TemplateConfigurationUpdate,
  BulkAttachToTemplate,
} from "@/types/entities"

import {
  createTemplateConfiguration,
  bulkAttachConfigurations,
  updateTemplateConfiguration,
  deleteTemplateConfiguration,
} from "@/lib/api/template_configuration"

interface TemplateConfigurationsStore {
  loading: boolean
  error: string | null

  attachConfiguration: (data: TemplateConfigurationCreate) => Promise<TemplateConfiguration | null>
  bulkAttachConfigurations: (data: BulkAttachToTemplate) => Promise<TemplateConfiguration[] | null>
  updateAttachment: (id: number, data: TemplateConfigurationUpdate) => Promise<TemplateConfiguration | null>
  removeAttachment: (id: number) => Promise<boolean>
}

export const useTemplateConfigurationsStore = create<TemplateConfigurationsStore>((set) => ({
  loading: false,
  error: null,

  attachConfiguration: async (data) => {
    set({ loading: true, error: null })
    try {
      return await createTemplateConfiguration(data)
    } catch (error: any) {
      set({ error: error.message })
      return null
    } finally {
      set({ loading: false })
    }
  },

  bulkAttachConfigurations: async (data) => {
    set({ loading: true, error: null })
    try {
      return await bulkAttachConfigurations(data)
    } catch (error: any) {
      set({ error: error.message })
      return null
    } finally {
      set({ loading: false })
    }
  },

  updateAttachment: async (id, data) => {
    set({ loading: true, error: null })
    try {
      return await updateTemplateConfiguration(id, data)
    } catch (error: any) {
      set({ error: error.message })
      return null
    } finally {
      set({ loading: false })
    }
  },

  removeAttachment: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteTemplateConfiguration(id)
      return true
    } catch (error: any) {
      set({ error: error.message })
      return false
    } finally {
      set({ loading: false })
    }
  },
}))
