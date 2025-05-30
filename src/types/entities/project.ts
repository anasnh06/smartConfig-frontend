// types/entities/project.ts

import type { ServerShort } from "./server"
import type { UserShort } from "./user"

export type Project = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by_user?: UserShort;
  updated_by_user?: UserShort;
  servers?: ServerShort[];
};

export type ProjectShort = {
  id: number;
  name: string;
};
