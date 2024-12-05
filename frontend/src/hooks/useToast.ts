import { useContext } from 'react';
import { handleError } from '../utils/handleError.ts';
import { ToastContext } from '../context/ToastContext.tsx';

/**
 * Custom Hook: `useToast`
 *
 * Provides access to the `ToastContext`, enabling components to display toast notifications.
 *
 * Features:
 * - Access the `showToast` function to trigger toast notifications with customizable messages, types, and durations.
 * - Ensures the hook is used within a `ToastProvider` to avoid errors.
 * - Logs a critical error using `handleError` if the hook is used outside a valid provider context.
 *
 * Dependencies:
 * - `ToastContext`: React context for managing toast notifications.
 * - `handleError`: Utility function for error handling.
 *
 * @returns The `ToastContext` containing:
 * - `showToast`: A function to display toast notifications.
 * - `toastId`: A mutable reference to the current toast ID.
 *
 * @throws Error if the hook is used outside a `ToastProvider`.
 *
 * @example
 * ```tsx
 * import { useToast } from '../hooks/useToast';
 *
 * const MyComponent = () => {
 *   const { showToast } = useToast();
 *
 *   const handleClick = () => {
 *     showToast({ message: 'Action successful!', type: 'success', duration: 3000 });
 *   };
 *
 *   return <button onClick={handleClick}>Show Toast</button>;
 * };
 * ```
 */

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    handleError(null, 'useToast must be used within a ToastProvider', 'critical', undefined);
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
