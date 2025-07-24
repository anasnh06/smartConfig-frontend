import { create } from "zustand"
import type { ServerConfiguration, CreateServerConfigurationData, UpdateServerConfigurationData } from "@/types/entities"
import {
  getServerConfigurations,
  createServerConfiguration,
  updateServerConfiguration,
  deleteServerConfiguration,
} from "@/lib/api/server_configuration"

interface ServerConfigurationsStore {
  serverConfigurations: ServerConfiguration[]
  loading: boolean
  error: string | null

  fetchServerConfigurations: () => Promise<void>
  reloadServerConfigurations: () => Promise<void>
  addServerConfiguration: (data: CreateServerConfigurationData) => Promise<void>
  updateServerConfiguration: (id: number, data: UpdateServerConfigurationData) => Promise<void>
  removeServerConfiguration: (id: number) => Promise<void>
  fetchServerConfigurationsByConfigId: (configId: number) => Promise<ServerConfiguration[]>
}

export const useServerConfigurationsStore = create<ServerConfigurationsStore>((set, get) => ({
  serverConfigurations: [],
  loading: false,
  error: null,

  fetchServerConfigurations: async () => {
    set({ loading: true, error: null })
    try {
      const serverConfigurations = await getServerConfigurations()
      set({ serverConfigurations })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadServerConfigurations: async () => {
    await get().fetchServerConfigurations()
  },

  addServerConfiguration: async (data) => {
    try {
      const newItem = await createServerConfiguration(data)
      set({
        serverConfigurations: [...get().serverConfigurations, newItem],
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateServerConfiguration: async (id, data) => {
    try {
      const updated = await updateServerConfiguration(id, data)
      set({
        serverConfigurations: get().serverConfigurations.map((item) =>
          item.id === id ? updated : item
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeServerConfiguration: async (id) => {
    try {
      await deleteServerConfiguration(id)
      set({
        serverConfigurations: get().serverConfigurations.filter((item) => item.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  fetchServerConfigurationsByConfigId: async (configId) => {
    set({ loading: true, error: null });
    try {
      // Suppose que l'API accepte le filtre ?configuration_id=...
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL as string}/api/v1/server-configurations/?configuration_id=${configId}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("❌ Failed to fetch server configurations for configuration");
      const serverConfigurations = await res.json();
      set({ serverConfigurations });
      return serverConfigurations;
    } catch (error: any) {
      set({ error: error.message });
      return [];
    } finally {
      set({ loading: false });
    }
  },
}))
