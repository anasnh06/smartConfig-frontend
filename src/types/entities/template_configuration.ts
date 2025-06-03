import type { TemplateShort } from "./template"
import type { ConfigurationShort } from "./configuration"
import type { UserShort } from "./user"

export type TemplateConfigurationShort = {
  id: number
  order?: number
  comment?: string
  configuration: ConfigurationShort
}

export type TemplateConfigurationShortForConfiguration = {
  id: number
  order?: number
  comment?: string
  template: TemplateShort
}

export type TemplateConfiguration = {
  id: number
  order?: number
  comment?: string
  created_at?: string
  updated_at?: string
  created_by_user?: UserShort
  updated_by_user?: UserShort
  template: TemplateShort
  configuration: ConfigurationShort
}

export type BulkAttachConfigurationItem = {
  configuration_id: number
  order?: number
  comment?: string
}

export type BulkAttachToTemplate = {
  template_id: number
  configurations: BulkAttachConfigurationItem[]
}
