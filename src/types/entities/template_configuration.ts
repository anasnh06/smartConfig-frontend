import type { ConfigurationShort } from "./configuration"
import type { TemplateShort } from "./template"
import type { UserShort } from "./user"

export type TemplateConfigurationShort = {
  id: number
  order?: number | null
  comment?: string | null
  configuration: ConfigurationShort
}

export type TemplateConfigurationShortForConfiguration = {
  id: number
  order?: number | null
  comment?: string | null
  template: TemplateShort
}

export type TemplateConfiguration = {
  id: number
  order?: number | null
  comment?: string | null
  created_at?: string | null
  updated_at?: string | null
  created_by_user?: UserShort | null
  updated_by_user?: UserShort | null
  template: TemplateShort
  configuration: ConfigurationShort
}

export type TemplateConfigurationCreate = {
  template_id: number
  configuration_id: number
  order?: number | null
  comment?: string | null
}

export type TemplateConfigurationUpdate = {
  order?: number | null
  comment?: string | null
}

export type BulkAttachConfigurationItem = {
  configuration_id: number
  order?: number | null
  comment?: string | null
}

export type BulkAttachToTemplate = {
  template_id: number
  configurations: BulkAttachConfigurationItem[]
}
