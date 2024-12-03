import { ToastProps } from '../context/ToastContext.tsx';

export const handleError = (
  error: unknown,
  userMessage: string,
  severity: 'critical' | 'warning' | 'info',
  showToast?: (props: ToastProps) => void
) => {
  console[severity === 'critical' ? 'error' : 'warn'](userMessage, error);
  if (showToast) {
    showToast({
      message: userMessage,
      type: severity === 'critical' ? 'error' : 'warning',
      duration: 3000,
    });
  }
};
