import type { UserShort } from "./user"
import type { RoleShort } from "./role"
import type { OperatingSystemShort } from "./operating-system"
import type { TemplateConfigurationShort } from "./template_configuration"
import type { ServerTemplateShort } from "./server_template"

export type Template = {
  id: number
  name: string
  description?: string | null
  created_at: string
  updated_at?: string | null
  created_by_user?: UserShort | null
  updated_by_user?: UserShort | null
  role?: RoleShort | null
  operating_systems: OperatingSystemShort[]
  template_configurations: TemplateConfigurationShort[]
  template_servers: ServerTemplateShort[]
}

export type TemplateShort = {
  id: number
  name: string
  role?: RoleShort | null
  operating_systems: OperatingSystemShort[]
}

export type CreateTemplateData = {
  name: string
  description?: string
  role_id?: number
  operating_system_ids: number[]
}

export type UpdateTemplateData = Partial<CreateTemplateData>
