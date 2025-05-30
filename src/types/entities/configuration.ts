import type { UserShort } from "./user"
export type Configuration = {
  id: string
  name: string
  description: string
  compatibleOsIds: string[]
  createdAt: string
  updatedAt: string
}

export type ConfigurationShort = {
  id: number
  name: string
}

