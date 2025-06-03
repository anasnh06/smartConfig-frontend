import type { OperatingSystemShort } from "./operating-system"
import type { RoleShort } from "./role"
import type { TemplateConfigurationShort } from "./template_configuration"
import type { ServerTemplateShortForTemplate } from "./server_template"
import type { UserShort } from "./user"

export type TemplateShort = {
  id: number
  name: string
  operating_systems: OperatingSystemShort[]
}

export type Template = {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at?: string
  created_by_user?: UserShort
  updated_by_user?: UserShort
  role?: RoleShort
  operating_systems: OperatingSystemShort[]
  template_configurations: TemplateConfigurationShort[]
  template_servers: ServerTemplateShortForTemplate[]
}
