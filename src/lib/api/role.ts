import { Role } from "@/types/entities"
const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getRoles(): Promise<Role[]> {
  const res = await fetch(`${API_URL}/api/v1/roles/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch roles")
  return res.json()
}

export async function getRole(id: number): Promise<Role> {
  const res = await fetch(`${API_URL}/api/v1/roles/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch role")
  return res.json()
}

export async function createRole(data: { name: string; description: string }): Promise<Role> {
  const res = await fetch(`${API_URL}/api/v1/roles/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create role")
  }
  return res.json()
}

export async function updateRole(id: number, data: { name: string; description: string }): Promise<Role> {
  const res = await fetch(`${API_URL}/api/v1/roles/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update role")
  }
  return res.json()
}

export async function deleteRole(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/roles/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete role")
  }
}
