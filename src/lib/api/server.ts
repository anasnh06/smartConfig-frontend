import type { Server, ServerShort, CreateServerData, UpdateServerData } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getServers(): Promise<Server[]> {
  const res = await fetch(`${API_URL}/api/v1/servers/`, { credentials: "include" })
  if (!res.ok) throw new Error("❌ Failed to fetch servers")
  return res.json()
}

export async function getServer(id: number): Promise<Server> {
  const res = await fetch(`${API_URL}/api/v1/servers/${id}`, { credentials: "include" })
  if (!res.ok) throw new Error("❌ Failed to fetch server")
  return res.json()
}

export async function getServerShorts(): Promise<ServerShort[]> {
  const res = await fetch(`${API_URL}/api/v1/servers/short`, { credentials: "include" })
  if (!res.ok) throw new Error("❌ Failed to fetch server shorts")
  return res.json()
}

export async function createServer(data: CreateServerData): Promise<Server> {
  const res = await fetch(`${API_URL}/api/v1/servers/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create server")
  }
  return res.json()
}

export async function updateServer(id: number, data: UpdateServerData): Promise<Server> {
  const res = await fetch(`${API_URL}/api/v1/servers/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update server")
  }
  return res.json()
}

export async function deleteServer(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/servers/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete server")
  }
}
export async function getServerSshStatus(id: number): Promise<{ status: string }> {
  const res = await fetch(`${API_URL}/api/v1/servers/${id}/ssh-status`, { credentials: "include" });
  if (!res.ok) throw new Error("❌ Failed to fetch SSH status");
  return res.json();
}