interface CustomCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  scale?: number;
  disableUncheck?: boolean;
  disabled?: boolean;
  onDisabledClick?: () => void;
}

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

  return (
    <label
      className="relative block cursor-pointer transform transition-transform"
      style={{ transform: `scale(${scale})` }}
      onClick={disabled ? onDisabledClick : undefined}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        disabled={disabled}
        className="opacity-0 absolute inset-0"
      />
      <span
        className={`absolute h-6 w-6 rounded transition-all duration-300 ${checked ? 'bg-red-600' : 'bg-gray-300'}`}
        style={{ top: '-12px', left: '-8px' }}
      />
      {checked && (
        <span
          className="absolute w-[5px] h-[10px] border-white border-2 border-t-0 border-l-0 transform rotate-45"
          style={{ top: '-6px', left: '1px' }}
        />
      )}
    </label>
  );
};

export default CustomCheckbox;
