import { create } from "zustand"
import type { Server,CreateServerData, UpdateServerData } from "@/types/entities"
import {
  getServers,
  createServer,
  updateServer,
  deleteServer,
} from "@/lib/api/server"

interface ServersStore {
  servers: Server[]
  loading: boolean
  error: string | null

  fetchServers: () => Promise<void>
  reloadServers: () => Promise<void>
  addServer: (data: CreateServerData) => Promise<void>
  updateServer: (id: number, data: UpdateServerData) => Promise<void>
  removeServer: (id: number) => Promise<void>
}

export const useServersStore = create<ServersStore>((set, get) => ({
  servers: [],
  loading: false,
  error: null,

  fetchServers: async () => {
    set({ loading: true, error: null })
    try {
      const servers = await getServers()
      set({ servers })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadServers: async () => {
    await get().fetchServers()
  },

  addServer: async (data) => {
    try {
      const newServer = await createServer(data)
      set({ servers: [...get().servers, newServer] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateServer: async (id, data) => {
    try {
      const updated = await updateServer(id, data)
      set({
        servers: get().servers.map((server) =>
          server.id === id ? updated : server
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeServer: async (id) => {
    try {
      await deleteServer(id)
      set({
        servers: get().servers.filter((server) => server.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
