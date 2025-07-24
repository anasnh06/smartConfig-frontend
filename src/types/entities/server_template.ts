import type { TemplateShort } from "./template"
import type { ServerShort } from "./server"
import type { UserShort } from "./user"
import type { ServerConfigurationShortForExecution } from "./server_configuration"

export type ServerTemplateShort = {
  id: number
  status?: string
  server: ServerShort
  template: TemplateShort
}

export type ServerTemplateShortForTemplate = {
  id: number
  status?: string
  server: ServerShort
}


export type ServerTemplate = {
  id: number
  status?: string
  started_at?: string
  finished_at?: string
  created_at?: string
  updated_at?: string
  created_by_user?: UserShort
  updated_by_user?: UserShort
  server: ServerShort
  template: TemplateShort
  server_configurations: ServerConfigurationShortForExecution[]
}

// Pour Create
export type CreateServerTemplateData = {
  status?: string
  server_id: number
  template_id: number
}

// Pour Update
export type UpdateServerTemplateData = Partial<CreateServerTemplateData>
