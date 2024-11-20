import { useState, useEffect } from 'react';

const AccessibilityToggle = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode((prev) => !prev);
  };
  useEffect(() => {
    if (isAccessibilityMode) {
      document.body.classList.add('accessibility-mode');
    } else {
      document.body.classList.remove('accessibility-mode');
    }
  }, [isAccessibilityMode]);

  return (
    <button
      onClick={toggleAccessibilityMode}
      className="px-4 py-2 font-sans bg-customRed text-white rounded hover:bg-black"
    >
      {isAccessibilityMode ? 'Disable Accessibility Mode' : 'Enable Accessibility Mode'}
    </button>
  );
};

export default AccessibilityToggle;
