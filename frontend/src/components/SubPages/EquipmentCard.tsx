import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

interface Equipment {
  id: string;
  index: string;
  name: string;
  category: string;
  value: number;
}
interface EquipmentCardProps {
  equipment: Equipment;
  isChecked: boolean;
  userId: string;
  onChange: (equipId: string, checked: boolean, equipment: Equipment) => void;
  disabled: boolean;
}

const EquipmentCard = ({ equipment, isChecked, onChange, disabled }: EquipmentCardProps) => {
  const handleCheckboxChange = (checked: boolean) => {
    onChange(equipment.id, checked, equipment);
  };

  return (
    <>
      <section className="flex flex-col  items-center justify-center gap-2 bg-customGray bg-opacity-60 p-12 rounded-b-lg">
        <h5 className="sub-header">{equipment.name}</h5>
        <p className="text">{equipment.category}</p>
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
