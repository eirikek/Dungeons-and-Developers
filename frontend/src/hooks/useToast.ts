import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext.tsx';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a fallback or throw an error
    return {
      showToast: () => {
        console.warn('Toast not available in this context.');
      },
      toastId: { current: null },
    };
  }
  return context;
};
