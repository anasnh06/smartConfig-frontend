import type { Project, ProjectShort } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/api/v1/projects/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch projects")
  return res.json()
}

export async function getProjectShorts(): Promise<ProjectShort[]> {
  const res = await fetch(`${API_URL}/api/v1/projects/short`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch project shorts")
  return res.json()
}

export async function getProject(id: number): Promise<Project> {
  const res = await fetch(`${API_URL}/api/v1/projects/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch project")
  return res.json()
}

export async function createProject(data: { name: string; description?: string }): Promise<Project> {
  const res = await fetch(`${API_URL}/api/v1/projects/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create project")
  }
  return res.json()
}

export async function updateProject(id: number, data: { name: string; description?: string }): Promise<Project> {
  const res = await fetch(`${API_URL}/api/v1/projects/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update project")
  }
  return res.json()
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete project")
  }
}
