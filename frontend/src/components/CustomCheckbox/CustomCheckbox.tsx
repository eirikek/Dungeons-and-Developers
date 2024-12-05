import React from 'react';
import CustomCheckboxProps from '../../interfaces/CustomCheckboxProps.ts';

/**
 * A custom checkbox component that handles different cases.
 *
 * @param {boolean} checked - The current checked state of the checkbox.
 * @param {(checked: boolean) => void} onChange - Function that handles when the state of the checkbox changes.
 * @param {number} scale - Transforms the scale
 * @param {boolean} disableUncheck- Disables the checkbox from unchecking
 * @param {boolean} disabled - Boolean value decides if the checkbox is disabled.
 * @param {() => void} onDisabledClick - Function to handle when the disabled checkbox is clicked.
 *
 */
const CustomCheckbox = ({
  checked = false,
  onChange,
  scale = 1,
  disableUncheck = false,
  disabled = false,
  onDisabledClick,
}: CustomCheckboxProps) => {
  const handleCheckboxChange = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    const newChecked = !checked;

    if (!disableUncheck || !checked) {
      onChange?.(newChecked);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleCheckboxChange();
    }
  };

  return (
    <label
      className="relative block cursor-pointer transform transition-transform "
      style={{ transform: `scale(${scale})` }}
      onClick={disabled ? onDisabledClick : undefined}
      onKeyDown={handleKeyDown}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="opacity-0 absolute inset-0 "
        disabled={disabled}
        aria-label="equipment-checkbox"
        name="checkbox"
        data-testid="equipment-checkbox"
      />
      <span
        className={`absolute h-6 w-6 rounded transition-all duration-300 ${checked ? 'bg-red-600' : 'bg-gray-300'} focus:outline-red-600 focus:outline-8 focus:outline `}
        style={{ top: '-12px', left: '-8px' }}
        aria-label="checkbox"
        tabIndex={disabled ? -1 : 0}
      />
      {checked && (
        <span
          className="absolute w-[5px] h-[10px] border-white border-2 border-t-0 border-l-0 transform rotate-45 focus:outline-red-600 focus:outline-8 focus:outline"
          style={{ top: '-6px', left: '1px' }}
          aria-label="checkbox"
        />
      )}
    </label>
  );
};

export default CustomCheckbox;
