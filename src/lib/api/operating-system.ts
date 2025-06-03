import type { OperatingSystem, OperatingSystemShort } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getOperatingSystems(): Promise<OperatingSystem[]> {
  const res = await fetch(`${API_URL}/api/v1/operating-systems/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch operating systems")
  return res.json()
}

export async function getOperatingSystemShorts(): Promise<OperatingSystemShort[]> {
  const res = await fetch(`${API_URL}/api/v1/operating-systems/short`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch operating system shorts")
  return res.json()
}


export async function getOperatingSystem(id: number): Promise<OperatingSystem> {
  const res = await fetch(`${API_URL}/api/v1/operating-systems/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch operating system")
  return res.json()
}

export async function createOperatingSystem(data: { name: string; version?: string }): Promise<OperatingSystem> {
  const res = await fetch(`${API_URL}/api/v1/operating-systems/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create operating system")
  }
  return res.json()
}

export async function updateOperatingSystem(
  id: number,
  data: { name?: string; version?: string }
): Promise<OperatingSystem> {
  const res = await fetch(`${API_URL}/api/v1/operating-systems/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update operating system")
  }
  return res.json()
}

export async function deleteOperatingSystem(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/operating-systems/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete operating system")
  }
}

