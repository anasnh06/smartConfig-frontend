"use client"

import { useEffect, useState } from "react"

interface ExecutionEvent {
  event: string
  [key: string]: any
}

export function useExecutionWebSocket(executionId: number) {
  const [events, setEvents] = useState<ExecutionEvent[]>([])
  const [status, setStatus] = useState<string>("pending")
  const [groupLogs, setGroupLogs] = useState<Record<number, string>>({})
  const [serverConfigs, setServerConfigs] = useState<Record<number, any>>({})

  useEffect(() => {
    if (!executionId) return

    const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws") || "ws://localhost:8000"
    const ws = new WebSocket(`${WS_URL}/ws/executions/${executionId}`)

    ws.onopen = () => {
      console.log("✅ WebSocket connecté :", executionId)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("📡 WS Event:", data)
      setEvents((prev) => [...prev, data])

      switch (data.event) {
        case "execution_status_update":
          if (data.status) setStatus(data.status)
          break
        case "group_stdout":
          setGroupLogs((prev) => ({
            ...prev,
            [data.group_id]: data.stdout,
          }))
          break
        case "server_config_update":
          setServerConfigs((prev) => ({
            ...prev,
            [data.server_config_id]: data,
          }))
          break
        default:
          break
      }
    }

    ws.onclose = () => {
      console.log("❌ WebSocket fermé :", executionId)
    }

    return () => {
      ws.close()
    }
  }, [executionId])

  return { events, status, groupLogs, serverConfigs }
}