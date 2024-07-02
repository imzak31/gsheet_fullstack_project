// src/structs/importFileStruct.ts
import { string, type, Struct } from 'superstruct';

export interface ImportFileResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      file_url: string;
      gcp_url: string;
      user_email: string;
      uploaded_at: string;
    };
  };
}

export function sImportFileResponse(): Struct<ImportFileResponse> {
  return type({
    data: type({
      id: string(),
      type: string(),
      attributes: type({
        file_url: string(),
        gcp_url: string(),
        user_email: string(),
        uploaded_at: string(),
      }),
    }),
  });
}
