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

  useEffect(() => {
    if (["success", "failed", "partial_success"].includes(status)) {
      setTimeout(() => {
        onClose()
        router.push(`/executions/${executionId}`)
      }, 1500)
    }
  }, [status, onClose, router, executionId])

  const getStatusIcon = () => {
    if (status === "success") return <CheckCircle2 className="text-green-500 w-10 h-10" />
    if (status === "failed") return <XCircle className="text-red-500 w-10 h-10" />
    if (status === "partial_success") return <CheckCircle2 className="text-yellow-500 w-10 h-10" />
    return <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full space-y-6 overflow-y-auto max-h-[90vh]">
        <div className="text-center space-y-2">
          {getStatusIcon()}
          <h2 className="text-xl font-semibold">
            {status === "pending" && "Execution in progress..."}
            {status === "running" && "Execution running..."}
            {status === "success" && "Execution completed successfully!"}
            {status === "failed" && "Execution failed!"}
            {status === "partial_success" && "Execution partially succeeded!"}
          </h2>

          <Progress
            value={
              status === "pending"
                ? 20
                : status === "running"
                  ? 60
                  : 100
            }
          />

          <p className="text-sm text-gray-500">
            Execution ID: {executionId}
          </p>
        </div>

        {/* Groupe logs */}
        {Object.entries(groupLogs).map(([groupId, stdout]) => (
          <div key={groupId} className="border p-4 rounded-lg bg-black text-green-300 text-sm max-h-[300px] overflow-y-auto">
            <h3 className="text-white font-semibold mb-2">🧪 Group {groupId} Output</h3>
            <pre className="whitespace-pre-wrap">{stdout}</pre>
          </div>
        ))}

        {/* ServerConfigurations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(serverConfigs).map(([scId, data]) => (
            <div key={scId} className="border rounded-lg p-3 bg-muted">
              <h4 className="text-sm font-semibold">🖥️ Server {data.server_id} - SC {scId}</h4>
              <p className="text-xs text-muted-foreground">Status: {data.status}</p>
              {data.return_code !== undefined && (
                <p className="text-xs text-muted-foreground">Code retour: {data.return_code}</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
