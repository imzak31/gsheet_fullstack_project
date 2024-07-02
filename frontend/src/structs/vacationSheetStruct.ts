// src/structs/VacationSheetStruct.ts
import { string, number, nullable, type, Struct } from 'superstruct';

export interface VacationSheet {
  id: number;
  external_id: number;
  name: string;
  email: string;
  leader: string;
  from_date: string;
  until_date: string;
  vacation_kind: string;
  reason: string | null;
  state: string | null;
  created_at: string;
  updated_at: string;
  vacation_days_taken: number;
}

export function sVacationSheet(): Struct<VacationSheet> {
  return type({
    id: number(),
    external_id: number(),
    name: string(),
    email: string(),
    leader: string(),
    from_date: string(),
    until_date: string(),
    vacation_kind: string(),
    reason: nullable(string()),
    state: nullable(string()),
    created_at: string(),
    updated_at: string(),
    vacation_days_taken: number(),
  });
}
