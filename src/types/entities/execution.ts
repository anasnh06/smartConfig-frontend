import type { ExecutionGroupShort } from "./execution_group"
import type { UserShort } from "./user"

export type ExecutionShort = {
  id: number
  title?: string
  status?: string
}

export type Execution = {
  id: number
  title?: string
  status?: string
  started_at?: string
  finished_at?: string
  created_at: string
  updated_at?: string
  created_by_user?: UserShort
  updated_by_user?: UserShort
  execution_groups: ExecutionGroupShort[]
}
