import { useContext } from 'react';
import { handleError } from '../../src/utils/handleError.ts';
import { ToastContext } from '../context/ToastContext.tsx';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    handleError(null, 'useToast must be used within a ToastProvider', 'critical');
  }
  return context;
};
