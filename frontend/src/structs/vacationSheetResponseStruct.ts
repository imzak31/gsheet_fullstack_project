// src/structs/vacationSheetResponseStruct.ts
import { array, type, number, object, nullable } from 'superstruct';
import { VacationSheet, sVacationSheet } from "./vacationSheetStruct";

export interface VacationSheetsResponse {
  vacation_sheets: VacationSheet[];
  meta: {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
  };
}

export function sVacationSheetsResponse() {
  return type({
    vacation_sheets: array(sVacationSheet()),
    meta: object({
      current_page: number(),
      next_page: nullable(number()),
      prev_page: nullable(number()),
      total_pages: number(),
      total_count: number(),
    }),
  });
}
