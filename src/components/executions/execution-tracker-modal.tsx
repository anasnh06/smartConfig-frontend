"use client"

import { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useExecutionWebSocket } from "@/hooks/use-execution-websocket"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface ExecutionTrackerModalProps {
  executionId: number
  isOpen: boolean
  onClose: () => void
}

export function ExecutionTrackerModal({
  executionId,
  isOpen,
  onClose,
}: ExecutionTrackerModalProps) {
  const { status, groupLogs, serverConfigs } = useExecutionWebSocket(executionId)
  const router = useRouter()

  // ✅ Redirection auto après fin d'exécution
  useEffect(() => {
    if (["success", "failed", "partial"].includes(status)) {
      const timeout = setTimeout(() => {
        onClose()
        router.push(`/executions/${executionId}`)
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [status, onClose, router, executionId])

  // 📊 Calcul de progression
  const totalConfigs = Object.keys(serverConfigs).length
  const doneConfigs = Object.values(serverConfigs).filter((sc) =>
    ["success", "failed", "partial"].includes(sc.status)
  ).length

  const progress = totalConfigs === 0
    ? status === "running"
      ? 60
      : status === "pending"
        ? 20
        : 100
    : Math.round((doneConfigs / totalConfigs) * 100)

  const getStatusIcon = () => {
    if (status === "success") return <CheckCircle2 className="text-green-500 w-10 h-10" />
    if (status === "failed") return <XCircle className="text-red-500 w-10 h-10" />
    if (status === "partial") return <CheckCircle2 className="text-yellow-500 w-10 h-10" />
    return <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full space-y-6 overflow-y-auto max-h-[90vh]">
        <div className="text-center space-y-2">
          {getStatusIcon()}
          <h2 className="text-xl font-semibold">
            {status === "pending" && "Exécution en attente..."}
            {status === "running" && "Exécution en cours..."}
            {status === "success" && "✅ Exécution terminée avec succès !"}
            {status === "failed" && "❌ Échec de l'exécution."}
            {status === "partial" && "⚠️ Exécution partiellement réussie."}
          </h2>

          <Progress value={progress} />

          <p className="text-sm text-gray-500">
            Execution ID: {executionId}
          </p>

          {["pending", "running"].includes(status) && (
            <button
              onClick={() => {
                onClose()
                router.push(`/executions/${executionId}`)
              }}
              className="mt-2 text-sm text-blue-500 underline hover:text-blue-700"
            >
              🔍 Voir les détails maintenant
            </button>
          )}
        </div>

        {/* 📄 Logs de groupe */}
        {Object.entries(groupLogs).map(([groupId, stdout]) => (
          <div key={groupId} className="border p-4 rounded-lg bg-black text-green-300 text-sm max-h-[300px] overflow-y-auto">
            <h3 className="text-white font-semibold mb-2">🧪 Sortie du groupe {groupId}</h3>
            <pre className="whitespace-pre-wrap">{stdout}</pre>
          </div>
        ))}

        {/* 📦 Résultats des ServerConfigurations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(serverConfigs).map(([scId, data]) => (
            <div key={scId} className="border rounded-lg p-3 bg-muted">
              <h4 className="text-sm font-semibold">
                🖥️ Serveur {data.server_id} – SC {scId}
              </h4>
              <p className="text-xs text-muted-foreground">Statut : {data.status}</p>
              {data.return_code !== undefined && (
                <p className="text-xs text-muted-foreground">
                  Code retour : {data.return_code}
                </p>
              )}
              {data.finished_at && (
                <p className="text-xs text-muted-foreground">
                  Terminé à : {new Date(data.finished_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
