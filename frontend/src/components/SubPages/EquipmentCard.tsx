import { EquipmentCardProps } from '../../interfaces/EquipmentProps.ts';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

/**
 * Renders EquipmentCard component displays information about an equipment item.
 *
 * @param {Object} equipment - Is the equipment, it's attributes are name and value.
 * @param {boolean} isChecked - Boolean value for the checkbox to say if it is checked.
 * @param {function} onChange - Function to handle checkbox state.
 * @param {boolean} disabled - Boolean value to see if the checkbox is disabled.
 * @param {function} onDisabledClick - Function for when the disabled checkbox is clicked.
 */

const EquipmentCard = ({ equipment, isChecked, onChange, disabled, onDisabledClick }: EquipmentCardProps) => {
  const handleCheckboxChange = (checked: boolean) => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    onChange(checked, equipment);
  };

  return (
    <>
      <section className="flex flex-col items-center justify-between gap-4 bg-black bg-opacity-85 py-10 px-4 rounded-xl w-full min-w-[18vw] h-[30vh] text-center card">
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
