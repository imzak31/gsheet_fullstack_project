import { Struct, assert } from 'superstruct';

export const fetchWithAuth = async <T>(
    endpoint: string,
    options: RequestInit = {},
    validator?: Struct<T>, // Optional validator
    handleSessionExpired?: () => void
): Promise<T> => {
  const authToken = localStorage.getItem('authToken');
  let headers: HeadersInit = {};

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorData = await response.json();
      if (errorData.messages && errorData.messages.includes('Invalid Email or Password.') && handleSessionExpired) {
        handleSessionExpired();
      }
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Optionally validate the data if validator is provided
  if (validator) {
    assert(data, validator);
  }

  return data;
};
