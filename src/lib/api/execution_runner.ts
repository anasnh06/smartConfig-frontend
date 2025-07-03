import type { Execution } from "@/types/entities"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const BASE = `${API_URL}/api/v1/execution-runners`

function handleError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    throw new Error(error.message || fallbackMessage)
  }
  throw new Error(fallbackMessage)
}

// === LANCEMENT D'UNE EXÉCUTION ===

export async function launchExecutionAsync(id: number): Promise<void> {
  const res = await fetch(`${BASE}/launch/async/${id}`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to launch execution (async)")
}

export async function launchExecutionCelery(id: number): Promise<void> {
  const res = await fetch(`${BASE}/launch/celery/${id}`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to launch execution (celery)")
}

// === LANCEMENT D'UN GROUPE ===

export async function launchGroupAsync(id: number): Promise<void> {
  const res = await fetch(`${BASE}/launch/group/async/${id}`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to launch group (async)")
}

export async function launchGroupCelery(id: number): Promise<void> {
  const res = await fetch(`${BASE}/launch/group/celery/${id}`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to launch group (celery)")
}

// === REPLAYS ===

export async function replayExecution(id: number): Promise<Execution> {
  const res = await fetch(`${BASE}/replay/execution/${id}`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to replay execution")
  }
  return res.json()
}

export async function replayGroup(id: number): Promise<Execution> {
  const res = await fetch(`${BASE}/replay/group/${id}`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to replay group")
  }
  return res.json()
}

export async function replayServerTemplate(id: number): Promise<Execution> {
  const res = await fetch(`${BASE}/replay/server_template/${id}`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to replay server template")
  }
  return res.json()
}

export async function replayServerConfiguration(id: number): Promise<Execution> {
  const res = await fetch(`${BASE}/replay/server_configuration/${id}`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to replay server configuration")
  }
  return res.json()
}

// === STATUTS ===

export async function getExecutionStatus(id: number): Promise<{
  id: number
  status: string
  started_at: string | null
  finished_at: string | null
}> {
  const res = await fetch(`${BASE}/execution/status/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch execution status")
  return res.json()
}

export async function getGroupStatus(id: number): Promise<{
  id: number
  status: string
  started_at: string | null
  finished_at: string | null
}> {
  const res = await fetch(`${BASE}/group/status/${id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("❌ Failed to fetch group status")
  return res.json()
}


export async function launchFullExecution(data: {
  title?: string
  groups: {
    name?: string
    servers: { id: number }[]
    elements: {
      type: "template" | "configuration" | "manual"
      id?: number
      command?: string
      name?: string
      description?: string
      order?: number
    }[]
  }[]
}): Promise<Execution> {
  const res = await fetch(`${BASE}/launch/full`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "❌ Failed to launch full execution")
  }

  return res.json()
}
