import type { UserShort } from "./user"
import type { ProjectShort } from "./project"
import type { OperatingSystemShort } from "./operating-system"
import type { EnvironmentShort } from "./environment"
import type { RoleShort } from "./role"
import type { ServerTemplateShort } from "./server_template"
import type { ServerConfigurationShort } from "./server_configuration"

export type Server = {
  id: number
  name: string
  ip_address: string
  ssh_port: number
  ssh_user: string
  ssh_private_key_path: string
  created_at: string
  updated_at?: string
  created_by_user?: UserShort
  updated_by_user?: UserShort
  operating_system: OperatingSystemShort
  environment: EnvironmentShort
  project: ProjectShort
  roles: RoleShort[]
  server_templates: ServerTemplateShort[]
  server_configurations: ServerConfigurationShort[]
}

export type ServerShort = {
  id: number
  name: string
  ip_address: string
  operating_system: OperatingSystemShort
}

export type CreateServerData = {
  name: string
  ip_address: string
  ssh_port: number
  ssh_user: string
  ssh_private_key_path?: string // Valeur par défaut backend
  operating_system_id: number
  environment_id: number
  project_id: number
  role_ids: number[]
}

export type UpdateServerData = Partial<CreateServerData>
