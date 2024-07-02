import { string, number, type, Struct } from "superstruct";

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export function sUser(): Struct<User> {
    return type({
        id: number(),
        name: string(),
        email: string(),
        created_at: string(),
        updated_at: string(),
    })
}
