import type { TemplateShort } from "./template"
import type { ServerShort } from "./server"
import type { UserShort } from "./user"
import type { ServerConfigurationShort } from "./server_configuration"

export type ServerTemplateShort = {
  id: number
  status?: string
  context?: string
  template: TemplateShort
}

export type ServerTemplateShortForTemplate = {
  id: number
  status?: string
  context?: string
  server: ServerShort
}

export type ServerTemplate = {
  id: number
  status?: string
  context?: string
  created_at?: string
  updated_at?: string
  created_by_user?: UserShort
  updated_by_user?: UserShort
  server: ServerShort
  template: TemplateShort
  server_configurations: ServerConfigurationShort[]
}
