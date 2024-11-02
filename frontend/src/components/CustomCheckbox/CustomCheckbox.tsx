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
      <input type="checkbox" checked={checked} onChange={handleCheckboxChange} disabled={disabled} />
      <span
        className={`absolute top-0 left-0 h-6 w-6 rounded bg-gray-300 transition-all duration-300 ${
          checked ? 'bg-red-600' : ''
        }`}
      />
      {checked && (
        <span className="absolute left-[9px] top-[5px] w-[5px] h-[10px] border-white border-2 border-t-0 border-l-0 transform rotate-45" />
      )}
    </label>
  );
};

export default CustomCheckbox;
