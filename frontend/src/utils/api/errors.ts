// src/utils/api/errors.ts
export const extractErrors = (errorResponse: Record<string, string[]>): Record<string, string> => {
  const errors: Record<string, string> = {};
  for (const [field, messages] of Object.entries(errorResponse)) {
    errors[field] = messages.join(', ');
  }
  return errors;
};
