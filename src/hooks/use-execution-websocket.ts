"use client"

import { useEffect, useRef, useState } from "react"

interface ExecutionEvent {
  event: string
  [key: string]: any
}

export function useExecutionWebSocket(executionId: number) {
  const [events, setEvents] = useState<ExecutionEvent[]>([])
  const [status, setStatus] = useState<string>("pending")
  const [groupLogs, setGroupLogs] = useState<Record<number, string>>({})
  const [serverConfigs, setServerConfigs] = useState<Record<number, any>>({})

  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!executionId) return

    const WS_URL =
      process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws") || "ws://localhost:8000"

    const ws = new WebSocket(`${WS_URL}/ws/executions/${executionId}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("✅ WebSocket connecté :", executionId)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("📡 WS Event:", data)
        setEvents((prev) => [...prev, data])

        switch (data.event) {
          case "execution_status_update":
            if (data.status) setStatus(data.status)
            break

          case "group_stdout":
            if (data.group_id && data.stdout) {
              setGroupLogs((prev) => ({
                ...prev,
                [data.group_id]: data.stdout,
              }))
            }
            break

          case "server_config_update":
            if (data.server_config_id) {
              setServerConfigs((prev) => ({
                ...prev,
                [data.server_config_id]: data,
              }))
            }
            break

          default:
            console.warn("❓ Événement WebSocket inconnu :", data)
        }
      } catch (err) {
        console.error("❌ Erreur de parsing WS event:", err)
      }
    }

    ws.onerror = (err) => {
      console.error("💥 WebSocket error:", err)
    }

    ws.onclose = () => {
      console.log("❌ WebSocket fermé :", executionId)
    }

    return () => {
      ws.close()
    }
  }, [executionId])

  return {
    events, // tous les événements reçus
    status, // statut global de l’exécution
    groupLogs, // stdout par groupe
    serverConfigs, // détails par config serveur
    isFinished: status === "success" || status === "failed" || status === "partial",
  }
}
