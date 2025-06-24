import type { Configuration, ConfigurationShort } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getConfigurations(): Promise<Configuration[]> {
  const res = await fetch(`${API_URL}/api/v1/configurations/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch configurations")
  return res.json()
}

export async function getConfiguration(id: number): Promise<Configuration> {
  const res = await fetch(`${API_URL}/api/v1/configurations/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch configuration")
  return res.json()
}

export async function getConfigurationShorts(): Promise<ConfigurationShort[]> {
  const res = await fetch(`${API_URL}/api/v1/configurations/short`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch configuration shorts")
  return res.json()
}

export async function createConfiguration(data: {
  name: string
  command: string
  description?: string
  operating_system_ids: number[]
}): Promise<Configuration> {
  const res = await fetch(`${API_URL}/api/v1/configurations/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create configuration")
  }
  return res.json()
}

export async function updateConfiguration(id: number, data: Partial<{
  name: string
  command: string
  description?: string
  operating_system_ids: number[]
}>): Promise<Configuration> {
  const res = await fetch(`${API_URL}/api/v1/configurations/${id}`, {
    method: "PATCH" ,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update configuration")
  }
  return res.json()
}

export async function deleteConfiguration(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/configurations/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete configuration")
  }
}
