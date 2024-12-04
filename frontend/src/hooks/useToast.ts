import { useContext } from 'react';
import { handleError } from '../utils/handleError.ts';
import { ToastContext } from '../context/ToastContext.tsx';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    handleError(null, 'useToast must be used within a ToastProvider', 'critical', undefined);
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
