export type Execution = {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "failed"
  templateId?: string
  configurationId?: string
  serverIds: string[]
  startedAt: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}
