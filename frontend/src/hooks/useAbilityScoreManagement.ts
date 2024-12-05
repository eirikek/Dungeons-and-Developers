import { abilitiesVar } from '../utils/apolloVars.ts';
import { useReactiveVar } from '@apollo/client';
import useCharacterContext from './useCharacter.ts';

/**
 * Custom Hook: `useAbilityScoreManagement`
 *
 * Provides functionality to manage ability scores, including updating scores and triggering side effects like toast notifications.
 *
 * Features:
 * - Reads and updates the reactive `abilitiesVar` state using Apollo's reactive variables.
 * - Interacts with `useCharacterContext` to persist updated ability scores.
 * - Displays toast notifications for successful updates or errors during the update process.
 *
 * @param showToast - A callback function to display toast notifications.
 *   - **Arguments:**
 *     - `message`: A string representing the notification message.
 *     - `type`: The type of notification (`'success' | 'error'`).
 *     - `duration`: The duration (in milliseconds) for the notification.
 *
 * @returns An object with the following properties:
 * - `handleCounterChange`: An asynchronous function to update an ability score.
 *   - **Parameters:**
 *     - `abilityName`: The name of the ability being updated.
 *     - `newValue`: The new value for the ability score.
 *   - Updates the reactive `abilitiesVar`, persists the update, and triggers a toast notification.
 * - `currentArrayScores`: A reactive variable (`Map<string, number>`) containing the current ability scores.
 */

const useAbilityScoreManagement = (
  showToast: (args: { message: string; type: 'success' | 'error'; duration: number }) => void
) => {
  const { updateAbilityScores } = useCharacterContext();
  const currentArrayScores = useReactiveVar(abilitiesVar);

  const handleCounterChange = async (abilityName: string, newValue: number) => {
    const updatedScores = new Map(currentArrayScores);
    updatedScores.set(abilityName, newValue);

    abilitiesVar(updatedScores);
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
  };

  return {
    handleCounterChange,
    currentArrayScores,
  };
};

export default useAbilityScoreManagement;
