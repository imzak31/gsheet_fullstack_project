// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from "../endpoints/endpoint";
import { UserCredentials } from "../structs/credentialStruct";
import { AuthResponse } from "../structs/authResponseStruct";
import { routePaths } from '../routes/routePaths';

const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const saveAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  const removeAuthToken = () => {
    localStorage.removeItem('authToken');
  };

  const signInMutation = useMutation<AuthResponse, Error, UserCredentials>({
    mutationFn: async (credentials: UserCredentials) => {
      const { data, headers } = await signIn(credentials);
      // Log headers to debug
      headers.forEach((value, name) => {
        console.log(`${name}: ${value}`);
      });
      const token = headers.get('Authorization')?.split(' ')[1];
      if (token) {
        saveAuthToken(token);
      } else {
        throw new Error('Failed to retrieve authentication token');
      }
      return data;
    },
    onSuccess: () => {
      navigate(routePaths.importSheet); // Redirect to ImportSheet page after successful sign-in
    },
  });

  const signUpMutation = useMutation<AuthResponse, Error, UserCredentials>({
    mutationFn: async (credentials: UserCredentials) => {
      const { data, headers } = await signUp(credentials);
      // Log headers to debug
      headers.forEach((value, name) => {
        console.log(`${name}: ${value}`);
      });
      const token = headers.get('Authorization')?.split(' ')[1];
      if (token) {
        saveAuthToken(token);
      } else {
        throw new Error('Failed to retrieve authentication token');
      }
      return data;
    },
    onSuccess: () => {
      navigate(routePaths.signIn); // Redirect to SignIn page after successful sign-up
    },
  });

  return {
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    removeAuthToken,
    signInMutation,
    signUpMutation,
  };
};

export default useAuth;
