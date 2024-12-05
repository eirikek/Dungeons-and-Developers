import { useContext } from 'react';
import { CharacterContext } from '../context/CharacterContext';

/**
 * Custom Hook: `useCharacter`
 *
 * Provides access to the `CharacterContext` for managing character-related state and actions.
 *
 * Features:
 * - Retrieves the current context value from `CharacterContext`.
 * - Ensures the hook is used within a `CharacterProvider`.
 * - Throws an error if the context is unavailable to prevent misuse outside of the provider.
 *
 * @returns The context value from `CharacterContext`, including state and utility functions.
 *
 * @throws Will throw an error if used outside of a `CharacterProvider`.
 *
 * Usage:
 * ```tsx
 * const { stateAbilities, updateAbilityScores, classes } = useCharacter();
 * ```
 */

const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

export default useCharacter;
