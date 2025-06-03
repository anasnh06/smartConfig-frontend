import type { OperatingSystemShort } from "./operating-system"
import type { ServerConfigurationShortForConfiguration } from "./server_configuration"
import type { TemplateConfigurationShortForConfiguration } from "./template_configuration"
import type { UserShort } from "./user"

export type ConfigurationShort = {
  id: number
  name: string
  operating_systems: OperatingSystemShort[]
}

export type Configuration = {
  id: number
  name: string
  command: string
  description?: string
  created_at: string
  updated_at?: string
  created_by_user: UserShort
  updated_by_user?: UserShort
  operating_systems: OperatingSystemShort[]
  configuration_servers: ServerConfigurationShortForConfiguration[]
  configuration_templates: TemplateConfigurationShortForConfiguration[]
}
