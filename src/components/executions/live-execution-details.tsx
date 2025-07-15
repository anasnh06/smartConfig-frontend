"use client"

import { useExecutionWebSocket } from "@/hooks/use-execution-websocket"

interface Props {
  executionId: number
}

export function LiveExecutionDetails({ executionId }: Props) {
  const { groupLogs, serverConfigs } = useExecutionWebSocket(executionId)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">📡 Suivi en temps réel</h2>

      {Object.entries(groupLogs).map(([groupId, stdout]) => (
        <div key={groupId} className="border p-4 rounded-lg bg-gray-950 text-green-300 text-sm max-h-[300px] overflow-y-auto">
          <h3 className="font-bold text-white mb-2">🧪 Groupe {groupId}</h3>
          <pre className="whitespace-pre-wrap">{stdout}</pre>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(serverConfigs).map(([scId, data]) => (
          <div key={scId} className="border rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-700">🖥️ Serveur {data.server_id} – SC {scId}</h4>
            <p className="text-xs text-gray-500">Status: {data.status}</p>
            {data.return_code !== undefined && (
              <p className="text-xs text-gray-500">Code retour: {data.return_code}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}