import React from 'react';
import { useLocation } from 'react-router-dom';
import accessibilityIcon from '../../assets/images/accessibility-icon.png';
import { useAccessibilityContext } from '../../context/AccessibilityContext.ts';

interface AccessibilityProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}
const AccessibilityToggle = ({ checked = false, onChange }: AccessibilityProps) => {
  const { isAccessibilityMode, toggleAccessibilityMode } = useAccessibilityContext();
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  const handleCheckboxChange = () => {
    const newChecked = !isAccessibilityMode;
    toggleAccessibilityMode();
    if (!checked) {
      onChange?.(newChecked);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleCheckboxChange();
    }
  };

  return (
    <label className="flex items-center cursor-pointer z-50" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="mr-3">
        <img
          src={accessibilityIcon}
          alt="accessability icon"
          className={`w-10 ${isLoginPage ? 'filter invert' : ''}`}
        />
      </div>
      <input
        type="checkbox"
        checked={isAccessibilityMode}
        onChange={toggleAccessibilityMode}
        className="sr-only"
        onKeyDown={handleKeyDown}
      />
      <span
        className={`relative inline-block w-14 h-8 rounded-full transition-colors ${
          isAccessibilityMode ? 'bg-[#E4BF36]' : 'bg-gray-400'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
            isAccessibilityMode ? 'translate-x-6' : ''
          }`}
        ></span>
      </span>
    </label>
  );
};

export default AccessibilityToggle;
