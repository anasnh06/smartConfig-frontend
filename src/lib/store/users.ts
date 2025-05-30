import { create } from "zustand"
import type { User } from "@/types/entities"
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/api/user"

type UsersStore = {
  users: User[]
  loading: boolean
  error: string | null

  fetchUsers: () => Promise<void>
  reloadUsers: () => Promise<void>
  addUser: (data: { username: string; email: string; password: string; is_active: boolean }) => Promise<void>
  updateUser: (id: number, data: { username: string; email: string; password?: string; is_active: boolean }) => Promise<void>
  removeUser: (id: number) => Promise<void>
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const users = await getUsers()
      set({ users })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadUsers: async () => {
    await get().fetchUsers()
  },

  addUser: async (data) => {
    try {
      const newUser = await createUser(data)
      set({ users: [...get().users, newUser] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateUser: async (id, data) => {
    try {
      const updated = await updateUser(id, data)
      set({
        users: get().users.map((user) => (user.id === id ? updated : user)),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeUser: async (id) => {
    try {
      await deleteUser(id)
      set({
        users: get().users.filter((user) => user.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
