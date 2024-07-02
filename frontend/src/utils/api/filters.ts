// src/utils/api/filters.ts
interface FilterParams {
  name?: string;
  email?: string;
  leader?: string;
  state?: string;
  from_date?: string;
  until_date?: string;
  vacation_kind?: string;
  reason?: string;
  page?: number;
}

export const createQueryParams = (params: FilterParams): string => {
  return Object.keys(params)
    .filter(key => params[key as keyof FilterParams] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof FilterParams] as string)}`)
    .join('&');
};
