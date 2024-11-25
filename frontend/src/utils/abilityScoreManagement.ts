import { abilitiesVar } from '../pages/mainPages/myCharacterPage';
import { useReactiveVar } from '@apollo/client';
import useCharacterContext from '../hooks/useCharacter';

const abilityScoreManagement = (
  showToast: (args: { message: string; type: 'success' | 'error'; duration: number }) => void
) => {
  const { updateAbilityScores } = useCharacterContext();
  const currentArrayScores = useReactiveVar(abilitiesVar);

  function handleCounterChange(abilityName: string, newValue: number) {
    const updatedScores = new Map(currentArrayScores);
    updatedScores.set(abilityName, newValue);

    abilitiesVar(updatedScores);
    (async () => {
      try {
        await updateAbilityScores(newValue, abilityName);
        showToast({
          message: `${abilityName} updated to ${newValue}`,
          type: 'success',
          duration: 3000,
        });
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
