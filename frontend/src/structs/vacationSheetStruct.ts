import { string, number, nullable, type, Struct } from 'superstruct';

export interface VacationSheet {
  id: number;
  from_date: string;
  until_date: string;
  vacation_kind: string;
  reason: string | null;
  state: string;
  created_at: string;
  updated_at: string;
  vacation_days_taken: number;
  employee: string;
  employee_email: string;
  employee_leader: string;
}

export function sVacationSheet(): Struct<VacationSheet> {
  return type({
    id: number(),
    from_date: string(),
    until_date: string(),
    vacation_kind: string(),
    reason: nullable(string()),
    state: string(),
    created_at: string(),
    updated_at: string(),
    vacation_days_taken: number(),
    employee: string(),
    employee_email: string(),
    employee_leader: string(),
  });
}
