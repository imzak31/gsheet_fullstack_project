import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import { routePaths } from '../routes/routePaths';

interface ErrorContextType {
  handleSessionExpired: () => void;
}

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSessionExpired = () => {
    setSnackbarMessage('Session expired');
    setSnackbarOpen(true);
    localStorage.removeItem('authToken');
    setTimeout(() => {
      navigate(routePaths.signIn);
    }, 3000);
  };

  return (
    <ErrorContext.Provider value={{ handleSessionExpired }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

