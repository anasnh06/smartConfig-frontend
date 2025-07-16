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

      {/* 📄 Logs des groupes */}
      {Object.entries(groupLogs).map(([groupId, stdout]) => (
        <div
          key={groupId}
          className="border border-gray-700 p-4 rounded-xl bg-gray-950 text-green-300 text-sm max-h-[300px] overflow-y-auto shadow-md"
        >
          <h3 className="font-bold text-white mb-2">🧪 Groupe {groupId}</h3>
          <pre className="whitespace-pre-wrap">{stdout}</pre>
        </div>
      ))}

      {/* 🖥️ Résultats par configuration serveur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(serverConfigs).map(([scId, data]) => (
          <div
            key={scId}
            className="border rounded-xl p-4 bg-white shadow-sm space-y-1"
          >
            <h4 className="text-sm font-semibold text-gray-800">
              🖥️ Serveur {data.server_id} – Conf {scId}
            </h4>
            <p className="text-xs text-gray-600">
              Statut : <span className="font-medium">{data.status}</span>
            </p>
            {data.return_code !== undefined && (
              <p className="text-xs text-gray-600">
                Code retour : <span className="font-medium">{data.return_code}</span>
              </p>
            )}
            {data.finished_at && (
              <p className="text-xs text-gray-500">Terminé à : {new Date(data.finished_at).toLocaleString()}</p>
            )}
          </div>
        ))}
      </div >
    </div>
  )
}
