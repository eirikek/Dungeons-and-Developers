import { useReactiveVar } from '@apollo/client';
import useCharacterContext from '../hooks/useCharacter';
import { abilitiesVar } from '../pages/mainPages/myCharacterPage';

/**
 * Ability Score Management Utility
 *
 * Handles the management and updates of D&D character ability scores.
 *
 * Features:
 * - Updates ability scores in reactive state
 * - Persists changes through character context
 * - Provides toast notifications for user feedback
 * - Error handling for failed updates
 *
 * Parameters:
 * @param {Function} showToast - Toast notification handler with message, type and duration
 *
 * Returns:
 * - handleCounterChange: Function to update individual ability scores
 * - currentArrayScores: Current state of all ability scores
 *
 * Usage:
 * ```ts
 * const { handleCounterChange, currentArrayScores } = abilityScoreManagement(showToast);
 * handleCounterChange('Strength', 15);
 * ```
 *
 * State Management:
 * - Uses Apollo reactive variables for local state
 * - Syncs with backend through CharacterContext
 *
 * @returns {Object} Score management functions and current state
 */
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
