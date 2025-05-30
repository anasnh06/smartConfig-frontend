import type { ServerShort } from "./server"
import type { TemplateShort } from "./template"
import type { UserShort } from "./user"

export type Role = {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
  created_by_user?: UserShort;
  updated_by_user?: UserShort;
  servers?: ServerShort[]
  templates?: TemplateShort[]
}

export type RoleShort = {
  id: number
  name: string
}
