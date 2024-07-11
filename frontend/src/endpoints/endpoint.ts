// src/endpoints/endpoint.ts
import {fetchWithAuth} from '../utils/api/fetchWithAuth';
import {AuthResponse} from '../structs/authResponseStruct';
import {Credentials} from '../structs/credentialStruct';
import {ImportFileResponse, sImportFileResponse} from '../structs/importFileStruct';
import {sVacationSheet, VacationSheet} from "../structs/vacationSheetStruct";
import {ImportErrorResponse} from "../structs/importErrorStruct";
import { CurrentUserResponse, CurrentUser, User } from '../structs/currentUserResponseStruct';
import {array} from 'superstruct';
import {createQueryParams} from "../utils/api/filters";

const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  SIGN_IN: `${API_BASE_URL}/users/sign_in`,
  SIGN_UP: `${API_BASE_URL}/users`,
  SIGN_OUT: `${API_BASE_URL}/users/sign_out`,
  IMPORT_FILE: `${API_BASE_URL}/sheets/import_files`,
  VACATION_SHEETS: `${API_BASE_URL}/sheets/vacation_sheets`,
  IMPORT_ERRORS: `${API_BASE_URL}/sheets/import_errors`,
  USERS_LIST: `${API_BASE_URL}/users/current_user`,
};

interface UserCredentials {
  user: Credentials;
}

// Sign In
export const signIn = async (credentials: UserCredentials): Promise<{ data: AuthResponse; headers: Headers }> => {
  const response = await fetch(ENDPOINTS.SIGN_IN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Log all headers to debug
  response.headers.forEach((value, name) => {
    console.log(`${name}: ${value}`);
  });

  return { data, headers: response.headers };
};

// Sign Up
export const signUp = async (credentials: UserCredentials): Promise<{ data: AuthResponse; headers: Headers }> => {
  const response = await fetch(ENDPOINTS.SIGN_UP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Log all headers to debug
  response.headers.forEach((value, name) => {
    console.log(`${name}: ${value}`);
  });

  return { data, headers: response.headers };
};

// Import File
export const importFile = async (file: File): Promise<ImportFileResponse> => {
  const formData = new FormData();
  formData.append('attachment[file]', file);

  return fetchWithAuth<ImportFileResponse>(
    ENDPOINTS.IMPORT_FILE,
    {
      method: 'POST',
      body: formData,
    },
    sImportFileResponse()
  );
};

// Get vacation sheets
export const getVacationSheets = async (page: number, filters: Record<string, string | number | null | undefined>): Promise<{ vacation_sheets: VacationSheet[], meta: { current_page: number; next_page: number | null; prev_page: number | null; total_pages: number; total_count: number; } }> => {
  const queryParams = createQueryParams({ ...filters, page });
  const data = await fetchWithAuth<VacationSheet[]>(
    `${ENDPOINTS.VACATION_SHEETS}?${queryParams}`,
    {
      method: 'GET',
    },
    array(sVacationSheet())
  );

  return {
    vacation_sheets: data,
    meta: {
      current_page: page,
      next_page: data.length === 10 ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      total_pages: Math.ceil(data.length / 10),
      total_count: data.length,
    },
  };
};

// Get Vacation Sheet by ID
export const getVacationSheetById = async (id: number): Promise<VacationSheet> => {
  return fetchWithAuth<VacationSheet>(
    `${ENDPOINTS.VACATION_SHEETS}/${id}`,
    {
      method: 'GET',
    },
    sVacationSheet()
  );
};

// Create Vacation Sheet
export const createVacationSheet = async (vacationSheet: Omit<VacationSheet, 'id' | 'vacation_days_taken'>): Promise<VacationSheet> => {
  return fetchWithAuth<VacationSheet>(
    ENDPOINTS.VACATION_SHEETS,
    {
      method: 'POST',
      body: JSON.stringify(vacationSheet),
    },
    sVacationSheet()
  );
};

// Update Vacation Sheet
export const updateVacationSheet = async (vacationSheet: VacationSheet): Promise<VacationSheet> => {
  const { id, ...rest } = vacationSheet;
  return await fetchWithAuth(
      `${ENDPOINTS.VACATION_SHEETS}/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rest),
      },
      sVacationSheet()
  );
};

// Delete Vacation Sheet
export const deleteVacationSheet = async (id: number): Promise<Response> => {
  const response = await fetch(`${ENDPOINTS.VACATION_SHEETS}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

// Get Import Errors
export const getImportErrors = async (page: number): Promise<ImportErrorResponse> => {
  return await fetchWithAuth<ImportErrorResponse>(
      `${ENDPOINTS.IMPORT_ERRORS}?page=${page}`,
      {
        method: 'GET',
      }
  );
};

export const getCurrentUserAndUsersList = async (): Promise<User[] | CurrentUser> => {
  const response = await fetchWithAuth<CurrentUserResponse>(
      ENDPOINTS.USERS_LIST,
      {
        method: 'GET',
      },
      CurrentUserResponse
  );

  if (response.all_users && response.all_users.length > 0) {
    return response.all_users;
  }

  return [response.user];
};
