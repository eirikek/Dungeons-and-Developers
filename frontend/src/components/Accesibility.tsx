import { useState, useEffect } from 'react';

const AccessibilityToggle = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('accesibility-mode') === 'true') {
      setIsAccessibilityMode(true);
    }
  }, []);

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode((prev) => !prev);
  };
  useEffect(() => {
    if (isAccessibilityMode) {
      localStorage.setItem('accesibility-mode', 'true');
      document.body.classList.add('accessibility-mode');
    } else {
      localStorage.setItem('accesibility-mode', 'false');
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
