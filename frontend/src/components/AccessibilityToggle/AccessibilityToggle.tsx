import { useState, useEffect } from 'react';
import accessabilityIcon from '../../assets/images/accessibility-icon.png';
import { useLocation } from 'react-router-dom';

const AccessibilityToggle = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

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
    <label className="flex items-center cursor-pointer z-50">
      <div className="mr-3 ">
        <img
          src={accessabilityIcon}
          alt="accessability icon"
          className={`w-10 ${isLoginPage ? 'filter invert' : ''}`}
        />
      </div>
      <input type="checkbox" checked={isAccessibilityMode} onChange={toggleAccessibilityMode} className="hidden" />
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
