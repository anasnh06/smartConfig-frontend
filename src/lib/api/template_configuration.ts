import type {
  TemplateConfiguration,
  TemplateConfigurationCreate,
  TemplateConfigurationUpdate,
  BulkAttachToTemplate,
} from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function createTemplateConfiguration(data: TemplateConfigurationCreate): Promise<TemplateConfiguration> {
  const res = await fetch(`${API_URL}/api/v1/template-configurations/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to attach configuration to template")
  }
  return res.json()
}

export async function bulkAttachConfigurations(data: BulkAttachToTemplate): Promise<TemplateConfiguration[]> {
  const res = await fetch(`${API_URL}/api/v1/template-configurations/bulk-attach`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to bulk attach configurations")
  }
  return res.json()
}

export async function updateTemplateConfiguration(
  id: number,
  data: TemplateConfigurationUpdate
): Promise<TemplateConfiguration> {
  const res = await fetch(`${API_URL}/api/v1/template-configurations/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update configuration attachment")
  }
  return res.json()
}

export async function deleteTemplateConfiguration(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/template-configurations/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete configuration attachment")
  }
}
