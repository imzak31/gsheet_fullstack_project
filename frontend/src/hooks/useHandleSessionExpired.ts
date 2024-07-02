import { useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';

const useHandleSessionExpired = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useHandleSessionExpired must be used within an ErrorProvider');
  }
  return context.handleSessionExpired;
};

export default useHandleSessionExpired;
