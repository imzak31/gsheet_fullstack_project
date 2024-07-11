import { string, number, type, Struct } from "superstruct";

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  leader: string;
  role: string;
}

export function sAuthResponse(): Struct<AuthResponse> {
  return type({
    id: number(),
    name: string(),
    email: string(),
    created_at: string(),
    updated_at: string(),
    leader: string(),
    role: string(),
  });
}
