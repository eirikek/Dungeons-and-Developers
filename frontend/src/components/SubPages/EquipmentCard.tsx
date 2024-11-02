import { EquipmentCardProps } from '../../interfaces/EquipmentProps.ts';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

const EquipmentCard = ({ equipment, isChecked, onChange, disabled }: EquipmentCardProps) => {
  const handleCheckboxChange = (checked: boolean) => {
    onChange(equipment.id, checked, equipment);
  };

  return (
    <>
      <section className="flex flex-col items-center justify-between gap-4 bg-black bg-opacity-80 py-10 px-4 rounded-xl w-full h-full min-w-[18vw] min-h-[30vh] text-center">
        <h3 className="text">{equipment.name}</h3>
        <p className="text">{`Value: ${equipment.value}`}</p>
        <CustomCheckbox
          scale={1.5}
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={disabled && !isChecked}
        />
      </section>
    </>
  );
};

export default EquipmentCard;
