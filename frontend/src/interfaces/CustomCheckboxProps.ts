export default interface CustomCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  scale?: number;
  disableUncheck?: boolean;
  disabled?: boolean;
  onDisabledClick?: () => void;
}
