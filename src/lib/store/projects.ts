import { create } from "zustand"
import type { Project } from "@/types/entities"
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/api/project"

type ProjectsStore = {
  projects: Project[]
  loading: boolean
  error: string | null

  fetchProjects: () => Promise<void>
  reloadProjects: () => Promise<void>
  addProject: (data: { name: string; description?: string }) => Promise<void>
  updateProject: (id: number, data: { name: string; description?: string }) => Promise<void>
  removeProject: (id: number) => Promise<void>
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const projects = await getProjects()
      set({ projects })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  reloadProjects: async () => {
    await get().fetchProjects()
  },

  addProject: async (data) => {
    try {
      const newProject = await createProject(data)
      set({ projects: [...get().projects, newProject] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateProject: async (id, data) => {
    try {
      const updated = await updateProject(id, data)
      set({
        projects: get().projects.map((project) =>
          project.id === id ? updated : project
        ),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  removeProject: async (id) => {
    try {
      await deleteProject(id)
      set({
        projects: get().projects.filter((project) => project.id !== id),
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
