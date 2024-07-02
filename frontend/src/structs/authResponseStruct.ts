// src/structs/authResponse.ts
import { string, type, Struct } from 'superstruct';
import { User, sUser } from './userStruct';

export interface AuthResponse {
  token: string;
  user: User;
}

export function sAuthResponse(): Struct<AuthResponse> {
  return type({
    token: string(),
    user: sUser(),
  });
}
