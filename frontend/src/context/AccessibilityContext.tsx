import React, { createContext, useContext, useEffect, useState } from 'react';

const AccessibilityContext = createContext({
  isAccessibilityMode: false,
  toggleAccessibilityMode: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('accesibility-mode') === 'true';
    setIsAccessibilityMode(storedMode);
    setIsInitialized(true);
  }, []);

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  useEffect(() => {
    if (isInitialized) {
      if (isAccessibilityMode) {
        localStorage.setItem('accesibility-mode', 'true');
        document.body.classList.add('accessibility-mode');
      } else {
        localStorage.setItem('accesibility-mode', 'false');
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

export const useAccessibility = () => useContext(AccessibilityContext);
