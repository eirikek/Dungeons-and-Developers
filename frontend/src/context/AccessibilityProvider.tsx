import { useEffect, useState } from 'react';
import { AccessibilityContext } from './AccessibilityContext';
import { AccessibilityProviderProps } from '../interfaces/AccessibilityProviderProps.ts';

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('accessibility-mode') === 'true';
    setIsAccessibilityMode(storedMode);
    setIsInitialized(true);
  }, []);

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  useEffect(() => {
    if (isInitialized) {
      if (isAccessibilityMode) {
        localStorage.setItem('accessibility-mode', 'true');
        document.body.classList.add('accessibility-mode');
      } else {
        localStorage.setItem('accessibility-mode', 'false');
        document.body.classList.remove('accessibility-mode');
      }
    }
  }, [isAccessibilityMode, isInitialized]);

  return (
    <AccessibilityContext.Provider value={{ isAccessibilityMode, toggleAccessibilityMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
