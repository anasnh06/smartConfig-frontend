import type { ServerShort } from "./server"
import type { ConfigurationShort } from "./configuration"
import type { ServerTemplateShort } from "./server_template"
import type { ExecutionGroupShort } from "./execution_group"
import type { UserShort } from "./user"

export type ServerConfigurationShort = {
  id: number
  status?: string
  return_code?: number
  configuration?: ConfigurationShort
}

export type ServerConfigurationShortForExecution = {
  id: number
  status?: string
  return_code?: number
  configuration?: ConfigurationShort
  server: ServerShort
}

export type ServerConfigurationShortForConfiguration = {
  id: number
  status?: string
  return_code?: number
  server: ServerShort
}

export type ServerConfiguration = {
  id: number
  status?: string
  return_code?: number
  stdout?: string
  stderr?: string
  started_at?: string
  finished_at?: string
  source?: string
  custom_command?: string
  created_at: string
  updated_at?: string
  created_by_user?: UserShort
  updated_by_user?: UserShort
  server: ServerShort
  execution_group: ExecutionGroupShort
  configuration?: ConfigurationShort
  server_template?: ServerTemplateShort
}
