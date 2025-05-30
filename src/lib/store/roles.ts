import { create } from "zustand"
import type { Role } from "@/types/entities"
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "@/lib/api/role"

type RolesStore = {
  roles: Role[]
  loading: boolean
  error: string | null

  fetchRoles: () => Promise<void>
  reloadRoles: () => Promise<void>
  addRole: (data: { name: string; description: string }) => Promise<void>
  updateRole: (id: number, data: { name: string; description: string }) => Promise<void>
  removeRole: (id: number) => Promise<void>
}

export const useRolesStore = create<RolesStore>((set, get) => ({
  roles: [],
  loading: false,
  error: null,

  fetchRoles: async () => {
    set({ loading: true, error: null })
    try {
      const roles = await getRoles()
      set({ roles })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadRoles: async () => {
    await get().fetchRoles()
  },

  addRole: async (data) => {
    try {
      const newRole = await createRole(data)
      set({ roles: [...get().roles, newRole] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateRole: async (id, data) => {
    try {
      const updated = await updateRole(id, data)
      set({
        roles: get().roles.map((role) => (role.id === id ? updated : role)),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeRole: async (id) => {
    try {
      await deleteRole(id)
      set({
        roles: get().roles.filter((role) => role.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
