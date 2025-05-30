export type Template = {
  id: string
  name: string
  description: string
  compatibleOsIds: string[]
  compatibleRoleIds: string[]
  configurationIds: string[]
  createdAt: string
  updatedAt: string
}


export type TemplateShort = {
  id: number
  name: string
}
