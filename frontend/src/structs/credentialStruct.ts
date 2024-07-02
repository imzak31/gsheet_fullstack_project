// src/structs/credentialStruct.ts
import { string, type, Struct } from 'superstruct';

export interface Credentials {
  email: string;
  password: string;
}

export function sCredentials(): Struct<Credentials> {
  return type({
    email: string(),
    password: string(),
  });
}

export interface UserCredentials {
  user: Credentials;
}

export function sUserCredentials(): Struct<UserCredentials> {
  return type({
    user: sCredentials(),
  });
}
