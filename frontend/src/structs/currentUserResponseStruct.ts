// src/structs/currentUserResponseStruct.ts
import { string, number, type, array, optional, Infer } from 'superstruct';

export const User = type({
    id: number(),
    email: string(),
    name: string(),
    leader: string(),
});

export type User = Infer<typeof User>;

export const CurrentUser = type({
    id: number(),
    email: string(),
    created_at: string(),
    updated_at: string(),
    name: string(),
    leader: string(),
    role: string(),
});

export type CurrentUser = Infer<typeof CurrentUser>;

export const CurrentUserResponse = type({
    user: CurrentUser,
    all_users: optional(array(User)),
});

export type CurrentUserResponse = Infer<typeof CurrentUserResponse>;
