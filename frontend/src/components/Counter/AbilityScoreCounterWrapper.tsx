import Counter from './Counter.tsx';

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
