export interface Equipment {
  id: string;
  index: string;
  name: string;
  category: string;
  value: number;
}

export interface EquipmentCardProps {
  equipment: Equipment;
  isChecked: boolean;
  onChange: (checked: boolean, equipment: Equipment) => void;
  disabled: boolean;
  onDisabledClick: () => void;
}
