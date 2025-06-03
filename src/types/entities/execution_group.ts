import type { ExecutionShort } from "./execution"
import type { ServerConfigurationShortForExecution } from "./server_configuration"
import type { UserShort } from "./user"

export type ExecutionGroupShort = {
  id: number
  name?: string
  status?: string
}

export type ExecutionGroup = {
  id: number
  name?: string
  status?: string
  playbook_path?: string
  inventory_path?: string
  started_at?: string
  finished_at?: string
  created_at: string
  updated_at?: string
  created_by_user?: UserShort
  updated_by_user?: UserShort
  execution: ExecutionShort
  server_configurations: ServerConfigurationShortForExecution[]
}
