import type { Template, TemplateShort, CreateTemplateData, UpdateTemplateData } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getTemplates(): Promise<Template[]> {
  const res = await fetch(`${API_URL}/api/v1/templates/`, { credentials: "include" })
  if (!res.ok) throw new Error("❌ Failed to fetch templates")
  return res.json()
}

export async function getTemplate(id: number): Promise<Template> {
  const res = await fetch(`${API_URL}/api/v1/templates/${id}`, { credentials: "include" })
  if (!res.ok) throw new Error("❌ Failed to fetch template")
  return res.json()
}

export async function getTemplateShorts(): Promise<TemplateShort[]> {
  const res = await fetch(`${API_URL}/api/v1/templates/short`, { credentials: "include" })
  if (!res.ok) throw new Error("❌ Failed to fetch template shorts")
  return res.json()
}

export async function createTemplate(data: CreateTemplateData): Promise<Template> {
  const res = await fetch(`${API_URL}/api/v1/templates/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create template")
  }
  return res.json()
}

export async function updateTemplate(id: number, data: UpdateTemplateData): Promise<Template> {
  const res = await fetch(`${API_URL}/api/v1/templates/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update template")
  }
  return res.json()
}

export async function deleteTemplate(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/templates/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete template")
  }
}
