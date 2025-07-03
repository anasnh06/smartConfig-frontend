import type { Execution, ExecutionShort, CreateExecutionData, UpdateExecutionData } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function getExecutions(): Promise<Execution[]> {
  const res = await fetch(`${API_URL}/api/v1/executions/`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch executions")
  return res.json()
}

export async function getExecution(id: number): Promise<Execution> {
  const res = await fetch(`${API_URL}/api/v1/executions/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch execution")
  return res.json()
}

export async function getExecutionShorts(): Promise<ExecutionShort[]> {
  const res = await fetch(`${API_URL}/api/v1/executions/short`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch execution shorts")
  return res.json()
}

export async function createExecution(data: CreateExecutionData): Promise<Execution> {
  const res = await fetch(`${API_URL}/api/v1/executions/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to create execution")
  }
  return res.json()
}

export async function updateExecution(id: number, data: UpdateExecutionData): Promise<Execution> {
  const res = await fetch(`${API_URL}/api/v1/executions/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to update execution")
  }
  return res.json()
}

export async function deleteExecution(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/executions/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to delete execution")
  }
}
