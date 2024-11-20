import { abilitiesVar } from '../pages/mainPages/myCharacterPage';
import { useReactiveVar } from '@apollo/client';
import useCharacterContext from '../hooks/useCharacter';

const abilityScoreManagement = () => {
  const { updateAbilityScores } = useCharacterContext();
  const currentArrayScores = useReactiveVar(abilitiesVar);

  function handleCounterChange(abilityName: string, newValue: number) {
    const updatedScores = new Map(currentArrayScores);
    updatedScores.set(abilityName, newValue);

    abilitiesVar(updatedScores);
    (async () => {
      try {
        await updateAbilityScores(newValue, abilityName);
      } catch (error) {
        console.error('Failed to update ability scores:', error);
      }
    })();
  }

  return {
    handleCounterChange,
    currentArrayScores,
  };
};

export default abilityScoreManagement;
