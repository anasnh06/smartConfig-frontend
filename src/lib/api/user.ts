import type { User } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/api/v1/users/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch users")
  return res.json()
}

export async function getUser(id: number): Promise<User> {
  const res = await fetch(`${API_URL}/api/v1/users/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch user")
  return res.json()
}

export async function createUser(data: {
  username: string
  email: string
  password: string
  is_active?: boolean
}): Promise<User> {
  const res = await fetch(`${API_URL}/api/v1/users/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create user")
  }
  return res.json()
}

export async function updateUser(id: number, data: {
  username?: string
  email?: string
  password?: string
  is_active?: boolean
}): Promise<User> {
  const res = await fetch(`${API_URL}/api/v1/users/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update user")
  }
  return res.json()
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete user")
  }
}
