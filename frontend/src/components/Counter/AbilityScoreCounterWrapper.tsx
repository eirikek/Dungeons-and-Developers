import Counter from '../Counter/Counter';

const AbilityCounterWrapper = ({
  initialValue,
  onUpdate,
}: {
  abilityName: string;
  initialValue: number;
  onUpdate: (value: number) => void;
}) => {
  const handleFinalizedChange = (value: number) => {
    onUpdate(value);
  };

  return (
    <Counter
      value={initialValue}
      onChange={(value) => console.log(`Intermediate value: ${value}`)}
      onValueFinalized={handleFinalizedChange}
      scale={1.5}
    />
  );
};

export default AbilityCounterWrapper;
