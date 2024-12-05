import Counter from './Counter.tsx';
/**
 * A custom wrapper for wrapping a custom Counter component.
 * It manages and the change in value and updates the parent when the value is finalized.
 *
 * @param {string} abilityName - Name of the ability score to be updated.
 * @param {number} initialValue - The initial value to be displayed in the counter.
 * @param {(value: number) => void} onUpdate - Function handle updated value.
 */
const AbilityCounterWrapper = ({
  initialValue,
  onUpdate,
}: {
  abilityName?: string;
  initialValue: number;
  onUpdate: (value: number) => void;
}) => {
  const handleFinalizedChange = (value: number) => {
    onUpdate(value);
  };

  return <Counter value={initialValue} onValueFinalized={handleFinalizedChange} scale={1.5} />;
};

export default AbilityCounterWrapper;
