import { useCallback, useEffect, useState } from 'react';
import { abilitiesVar } from '../pages/mainPages/myCharacterPage.tsx';
import { useReactiveVar } from '@apollo/client';
import useCharacterContext from '../hooks/useCharacter.ts';
import abilityScoreMap from './abilityScoreMapping.ts';

const useAbilityScoreManagement = () => {
  const { userAbilityScores, updateAbilityScores } = useCharacterContext();
  const currentArrayScores = useReactiveVar(abilitiesVar);
  const [hasInteractedScores, setHasInteractedScores] = useState(false);

  const saveToContext = useCallback(
    async (newMap: Map<string, number>, updatedAbilityName: string) => {
      await updateAbilityScores(newMap, updatedAbilityName);
    },
    [updateAbilityScores]
  );

  const handleCounterChange = useCallback(
    async (index: number, newValue: number, abilityScoreMap: Record<string, number>) => {
      if (!Number.isFinite(newValue)) {
        console.error(`Invalid score value: ${newValue}`);
        return;
      }
      const updatedScores = new Map(userAbilityScores);
      let updatedAbilityName = '';

      Object.entries(abilityScoreMap).forEach(([key, idx]) => {
        const value = idx === index ? newValue : (updatedScores.get(key) ?? 0);
        updatedScores.set(key, value);

        if (idx === index) {
          updatedAbilityName = key;
        }
      });

      setHasInteractedScores(true);
      abilitiesVar(updatedScores);
      await saveToContext(updatedScores, updatedAbilityName);
    },
    [saveToContext, userAbilityScores]
  );

  const handleUpdateScores = useCallback(
    (abilityScoreMap: Record<string, number>) => {
      if (!hasInteractedScores) return;

      currentArrayScores.forEach((value, key) => {
        handleCounterChange(abilityScoreMap[key], value, abilityScoreMap);
      });
    },
    [currentArrayScores, handleCounterChange, hasInteractedScores]
  );

  useEffect(() => {
    if (hasInteractedScores) {
      const timer = setTimeout(() => {
        handleUpdateScores(abilityScoreMap);
        setHasInteractedScores(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [handleUpdateScores, hasInteractedScores]);

  return {
    saveToContext,
    handleCounterChange,
    handleUpdateScores,
    currentArrayScores,
    setHasInteractedScores,
  };
};

export default useAbilityScoreManagement;
