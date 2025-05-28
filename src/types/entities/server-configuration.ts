export type ServerConfiguration = {
  id: string
  serverId: string
  configurationId: string
  status: "pending" | "completed" | "failed"
  executedAt: string
  createdAt: string
  updatedAt: string
}
