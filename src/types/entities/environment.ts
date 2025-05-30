import type { ServerShort } from "./server"
import type { UserShort } from "./user"
export type Environment = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
  created_by_user?: UserShort;
  updated_by_user?: UserShort;
  servers?: ServerShort[]
}

export type EnvironmentShort = {
  id: number
  name: string
}
