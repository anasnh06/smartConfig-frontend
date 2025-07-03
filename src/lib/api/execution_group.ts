import type {
  ExecutionGroup,
  ExecutionGroupShort,
  CreateExecutionGroupData,
  UpdateExecutionGroupData,
} from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getExecutionGroups(): Promise<ExecutionGroup[]> {
  const res = await fetch(`${API_URL}/api/v1/execution-groups/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch execution groups")
  return res.json()
}

export async function getExecutionGroup(id: number): Promise<ExecutionGroup> {
  const res = await fetch(`${API_URL}/api/v1/execution-groups/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch execution group")
  return res.json()
}

export async function getExecutionGroupShorts(): Promise<ExecutionGroupShort[]> {
  const res = await fetch(`${API_URL}/api/v1/execution-groups/short`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch execution group shorts")
  return res.json()
}

export async function createExecutionGroup(data: CreateExecutionGroupData): Promise<ExecutionGroup> {
  const res = await fetch(`${API_URL}/api/v1/execution-groups/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create execution group")
  }
  return res.json()
}

export async function updateExecutionGroup(id: number, data: UpdateExecutionGroupData): Promise<ExecutionGroup> {
  const res = await fetch(`${API_URL}/api/v1/execution-groups/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update execution group")
  }
  return res.json()
}

export async function deleteExecutionGroup(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/execution-groups/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete execution group")
  }
}
