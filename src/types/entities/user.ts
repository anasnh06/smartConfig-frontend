// types/entities/user.ts

export type UserShort = {
  id: number;
  username: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  creator?: UserShort;
  updater?: UserShort;
};
