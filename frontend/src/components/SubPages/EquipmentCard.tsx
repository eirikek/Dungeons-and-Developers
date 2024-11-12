import { EquipmentCardProps } from '../../interfaces/EquipmentProps.ts';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

const EquipmentCard = ({ equipment, isChecked, onChange, disabled, onDisabledClick }: EquipmentCardProps) => {
  const handleCheckboxChange = (checked: boolean) => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    onChange(equipment.id, checked, equipment);
  };

  return (
    <>
      <section className="flex flex-col items-center justify-between gap-4 bg-black bg-opacity-80 py-10 px-4 rounded-xl w-full min-w-[18vw] h-[30vh] text-center">
        <h3 className="text">{equipment.name}</h3>
        <p className="text">{`Value: ${equipment.value}`}</p>
        <CustomCheckbox
          scale={1.5}
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={disabled}
          onDisabledClick={onDisabledClick}
        />
      </section>
    </>
  );
};

export default EquipmentCard;
