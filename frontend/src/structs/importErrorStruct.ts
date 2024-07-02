// src/structs/ImportErrorStruct.ts
import { string, number, type, array, Struct, nullable } from 'superstruct';

export interface ImportError {
  id: number;
  import_id: number;
  data: string; // JSON string
  error_messages: string;
  created_at: string;
  updated_at: string;
}

export interface ImportErrorMeta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
}

export interface ImportErrorResponse {
  data: {
    id: string;
    type: string;
    attributes: ImportError;
  }[];
  meta: ImportErrorMeta;
}

export function sImportError(): Struct<ImportError> {
  return type({
    id: number(),
    import_id: number(),
    data: string(),
    error_messages: string(),
    created_at: string(),
    updated_at: string(),
  });
}

export function sImportErrorMeta(): Struct<ImportErrorMeta> {
  return type({
    current_page: number(),
    next_page: nullable(number()),
    prev_page: nullable(number()),
    total_pages: number(),
    total_count: number(),
  });
}

export function sImportErrorResponse(): Struct<ImportErrorResponse> {
  return type({
    data: array(type({
      id: string(),
      type: string(),
      attributes: sImportError(),
    })),
    meta: sImportErrorMeta(),
  });
}
