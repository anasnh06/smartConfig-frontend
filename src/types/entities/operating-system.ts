import type { ServerShort } from "./server";
import type { TemplateShort } from "./template";
import type { ConfigurationShort } from "./configuration";
import type { UserShort } from "./user"

export type OperatingSystem = {
  id: number;
  name: string;
  version?: string;
  created_at?: string;
  updated_at?: string;
  created_by_user?: UserShort;
  updated_by_user?: UserShort;
  servers?: ServerShort[];
  configurations?: ConfigurationShort[];
  templates?: TemplateShort[];
};

export type OperatingSystemShort = {
  id: number;
  name: string;
  version?: string;
};
