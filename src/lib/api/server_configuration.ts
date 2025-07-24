import type {
  ServerConfiguration,
  ServerConfigurationShort,
  CreateServerConfigurationData,
  UpdateServerConfigurationData,
} from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getServerConfigurations(): Promise<ServerConfiguration[]> {
  const res = await fetch(`${API_URL}/api/v1/server-configurations/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch server configurations")
  return res.json()
}

export async function getServerConfiguration(id: number): Promise<ServerConfiguration> {
  const res = await fetch(`${API_URL}/api/v1/server-configurations/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch server configuration")
  return res.json()
}

export async function getServerConfigurationShorts(): Promise<ServerConfigurationShort[]> {
  const res = await fetch(`${API_URL}/api/v1/server-configurations/short`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch server configuration shorts")
  return res.json()
}

export async function createServerConfiguration(data: CreateServerConfigurationData): Promise<ServerConfiguration> {
  const res = await fetch(`${API_URL}/api/v1/server-configurations/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create server configuration")
  }
  return res.json()
}

export async function updateServerConfiguration(
  id: number,
  data: UpdateServerConfigurationData
): Promise<ServerConfiguration> {
  const res = await fetch(`${API_URL}/api/v1/server-configurations/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update server configuration")
  }
  return res.json()
}

export async function deleteServerConfiguration(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/server-configurations/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete server configuration")
  }
}

export async function getServerConfigurationsByConfigId(configId: number): Promise<ServerConfiguration[]> {
  const res = await fetch(`${API_URL}/api/v1/server-configurations/?configuration_id=${configId}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch server configurations for configuration")
  return res.json()
}
