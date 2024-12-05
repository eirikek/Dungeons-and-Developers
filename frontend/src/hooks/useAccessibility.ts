import { useContext } from 'react';
import { AccessibilityContext } from '../context/AccessibilityContext.tsx';
import { handleError } from '../utils/handleError.ts';

/**
 * Custom Hook: `useAccessibility`
 *
 * Provides access to the `AccessibilityContext` for managing accessibility-related state and actions.
 *
 * Features:
 * - Retrieves the current accessibility context.
 * - Ensures that the hook is used within an `AccessibilityProvider`.
 * - Logs error using the `handleError` utility if the context is unavailable.
 *
 * @returns The context value from `AccessibilityContext`.
 *
 * @throws Will log an error and return undefined if used outside of an `AccessibilityProvider`.
 *
 * Usage:
 * ```tsx
 * const { isAccessibleMode, toggleAccessibilityMode } = useAccessibility();
 * ```
 */

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    handleError(null, 'useAccessbility must be used tithin a AccessibilityProvider', 'critical');
  }
  return context;
};
