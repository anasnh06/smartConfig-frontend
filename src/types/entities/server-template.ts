export type ServerTemplate = {
  id: string
  serverId: string
  templateId: string
  status: "pending" | "completed" | "failed"
  executedAt: string
  createdAt: string
  updatedAt: string
}
