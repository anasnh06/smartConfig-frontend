import type {
  ServerTemplate,
  ServerTemplateShort,
  CreateServerTemplateData,
  UpdateServerTemplateData,
} from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getServerTemplates(): Promise<ServerTemplate[]> {
  const res = await fetch(`${API_URL}/api/v1/server-templates/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch server templates")
  return res.json()
}

export async function getServerTemplate(id: number): Promise<ServerTemplate> {
  const res = await fetch(`${API_URL}/api/v1/server-templates/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch server template")
  return res.json()
}

export async function getServerTemplateShorts(): Promise<ServerTemplateShort[]> {
  const res = await fetch(`${API_URL}/api/v1/server-templates/short`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch server template shorts")
  return res.json()
}

export async function createServerTemplate(data: CreateServerTemplateData): Promise<ServerTemplate> {
  const res = await fetch(`${API_URL}/api/v1/server-templates/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create server template")
  }
  return res.json()
}

export async function updateServerTemplate(
  id: number,
  data: UpdateServerTemplateData
): Promise<ServerTemplate> {
  const res = await fetch(`${API_URL}/api/v1/server-templates/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update server template")
  }
  return res.json()
}

export async function deleteServerTemplate(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/server-templates/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete server template")
  }
}
