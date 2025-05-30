import type { Environment } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getEnvironments(): Promise<Environment[]> {
  const res = await fetch(`${API_URL}/api/v1/environments/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch environments")
  return res.json()
}

export async function getEnvironment(id: number): Promise<Environment> {
  const res = await fetch(`${API_URL}/api/v1/environments/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch environment")
  return res.json()
}

export async function createEnvironment(data: { name: string }): Promise<Environment> {
  const res = await fetch(`${API_URL}/api/v1/environments/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create environment")
  }
  return res.json()
}

export async function updateEnvironment(id: number, data: { name: string }): Promise<Environment> {
  const res = await fetch(`${API_URL}/api/v1/environments/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update environment")
  }
  return res.json()
}

export async function deleteEnvironment(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/environments/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete environment")
  }
}
