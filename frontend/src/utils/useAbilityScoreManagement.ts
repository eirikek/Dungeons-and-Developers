import { useCallback } from 'react';
import { abilitiesVar } from '../pages/mainPages/myCharacterPage';
import { useReactiveVar } from '@apollo/client';
import useCharacterContext from '../hooks/useCharacter';

const useAbilityScoreManagement = () => {
  const { updateAbilityScores } = useCharacterContext();
  const currentArrayScores = useReactiveVar(abilitiesVar);

  const handleCounterChange = useCallback(
    async (index: number, newValue: number, abilityScoreMap: Record<string, number>) => {
      if (!Number.isFinite(newValue)) {
        console.error(`Invalid score value: ${newValue}`);
        return;
      }

      const updatedAbilityName = Object.entries(abilityScoreMap).find(([_, idx]) => idx === index)?.[0];
      if (!updatedAbilityName) {
        console.error(`Invalid index: ${index}`);
        return;
      }

      await updateAbilityScores(newValue, updatedAbilityName);
    },
    [updateAbilityScores]
  );

  return {
    handleCounterChange,
    currentArrayScores,
  };
};

export default useAbilityScoreManagement;
