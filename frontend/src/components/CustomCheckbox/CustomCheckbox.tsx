import { useState } from 'react';

interface CustomCheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  scale?: number;
}

const CustomCheckbox = ({ checked = false, onChange, scale = 1, disabled = false }: CustomCheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      if (onChange) {
        onChange(newChecked);
      }
      return newChecked;
    });
  };

  return (
    <label
      className="relative block cursor-pointer transform transition-transform"
      style={{ transform: `scale(${scale})` }} // Apply the scale dynamically
    >
      <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} disabled={disabled} />
      {/* Checkbox background */}
      <span
        className={`absolute top-0 left-0 h-6 w-6 rounded bg-gray-300 transition-all duration-300 ${
          isChecked ? 'bg-red-600' : ''
        }`}
      />
      {/* Checkmark icon */}
      {isChecked && (
        <span className="absolute left-[9px] top-[5px] w-[5px] h-[10px] border-white border-2 border-t-0 border-l-0 transform rotate-45" />
      )}
    </label>
  );
};

export default CustomCheckbox;
