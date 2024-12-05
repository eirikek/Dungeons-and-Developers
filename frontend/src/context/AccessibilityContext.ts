import { createContext, useContext } from 'react';

export const AccessibilityContext = createContext({
  isAccessibilityMode: false,
  toggleAccessibilityMode: () => {},
});
export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterProvider');
  }
  return context;
};
