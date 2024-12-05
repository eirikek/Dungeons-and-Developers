import { useContext } from 'react';
import { AccessibilityContext } from '../../src/context/AccessibilityContext.tsx';
import { handleError } from '../../src/utils/handleError.ts';

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    handleError(null, 'useAccessbility must be used tithin a AccessibilityProvider', 'critical');
  }
  return context;
};
