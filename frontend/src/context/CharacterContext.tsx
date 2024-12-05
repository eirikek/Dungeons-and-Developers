import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { createContext, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { UPDATE_ABILITY_SCORES, UPDATE_USER_CLASS, UPDATE_USER_RACE } from '../graphql/mutations/userMutations.ts';
import { GET_ARRAY_SCORES, GET_USER_CLASS, GET_USER_RACE } from '../graphql/queries/userQueries.ts';
import useAbilityScores from '../hooks/useAbilityScores.ts';
import useClasses from '../hooks/useClasses.ts';
import useRaces from '../hooks/useRaces.ts';
import { useToast } from '../hooks/useToast.ts';
import useUserEquipments from '../hooks/useUserEquipments';
import { Equipment } from '../interfaces/EquipmentProps';
import { abilitiesVar } from '../utils/apolloVars.ts';
import { classVar } from '../utils/apolloVars.ts';
import { raceVar } from '../utils/apolloVars.ts';
import { ArrayScores, ArrayVar, UserClass, UserRace } from '../graphql/queryInterface.ts';
import { UserNotFound } from '../utils/UserNotFound.ts';
import { handleError } from '../utils/handleError.ts';
import { CharacterContextType, CharacterProviderProps } from '../interfaces/CharacterContextProps.ts';

/**
 * CharacterContext
 *
 * Provides a context for managing character-related data and state in the application, including:
 * - Ability scores, classes, races, and equipment.
 * - Operations to update and manage the user's character details.
 * - Loading states for asynchronous operations such as fetching or updating data.
 *
 * Features:
 * - Integrates GraphQL queries and mutations for fetching and updating character data.
 * - Uses Apollo Client's reactive variables for caching and state management.
 * - Exposes utility functions for modifying character-related data (e.g., ability scores, class, race, and equipment).
 * - Handles error reporting using a custom `handleError` utility.
 *
 * Components:
 * - `CharacterContext`: Context object for accessing and updating character-related data.
 * - `CharacterProvider`: Provider component that supplies the context to its children.
 *
 * Context Value:
 * - `stateAbilities`: List of ability scores with names and values.
 * - `userAbilityScores`: A `Map` of the user's ability scores.
 * - `updateAbilityScores(newValue: number, updatedAbilityName: string)`: Updates a specific ability score.
 * - `classes`: List of available character classes.
 * - `updateClass(classId: string)`: Updates the user's selected class.
 * - `races`: List of available character races.
 * - `updateRace(raceId: string)`: Updates the user's selected race.
 * - `addToEquipments(equipment: Equipment)`: Adds an equipment item to the user's inventory.
 * - `removeFromEquipments(equipment: Equipment)`: Removes an equipment item from the user's inventory.
 * - `removeAllEquipments()`: Clears all equipment items from the user's inventory.
 * - `loadingStates`: Object containing boolean flags for loading states of various operations.
 *
 * Props:
 * - `CharacterProviderProps`: Requires `children` to wrap in the provider and `userId` for fetching data.
 *
 * Usage:
 * - Application root wrapped with `<CharacterProvider>` to provide context.
 * - Access the context using `useContext(CharacterContext)` in child components.
 */

export const CharacterContext = createContext<CharacterContextType>({
  stateAbilities: [],
  userAbilityScores: new Map<string, number>(),
  updateAbilityScores: async () => Promise.resolve(),
  classes: [],
  updateClass: async () => Promise.resolve(),
  races: [],
  updateRace: async () => Promise.resolve(),
  addToEquipments: () => {},
  removeFromEquipments: () => {},
  removeAllEquipments: () => {},
  loadingStates: {
    equipmentsLoading: false,
    classLoading: false,
    abilityScoresLoading: false,
    raceLoading: false,
  },
});

export const CharacterProvider = ({ children, userId }: CharacterProviderProps) => {
  const { showToast } = useToast();

  const location = useLocation();
  const currentPath = location.pathname;

  const shouldFetchAbilityScores = currentPath.includes('/abilityscore') || currentPath.includes('/mycharacter');
  const shouldFetchUserClass = currentPath.includes('/class') || currentPath.includes('/mycharacter');
  const shouldFetchUserRace = currentPath.includes('/race') || currentPath.includes('/mycharacter');

  const abilityScores = useReactiveVar(abilitiesVar);

  const { classes: fetchedClasses } = useClasses(1, 12, shouldFetchUserClass);
  const { races: fetchedRaces } = useRaces(1, 12, shouldFetchUserRace);
  const { abilities: dataAbilities } = useAbilityScores(1, 6, shouldFetchAbilityScores);

  const { data: scoreData, loading: abilityScoresLoading } = useQuery<ArrayScores, ArrayVar>(GET_ARRAY_SCORES, {
    variables: { userId },
    skip: !userId || !shouldFetchAbilityScores,
    fetchPolicy: 'cache-and-network',
  });

  const { data: userClassData, loading: classLoading } = useQuery(GET_USER_CLASS, {
    variables: { userId },
    skip: !userId || !shouldFetchUserClass,
    fetchPolicy: 'cache-first',
  });

  const { data: userRaceData, loading: raceLoading } = useQuery(GET_USER_RACE, {
    variables: { userId },
    skip: !userId || !shouldFetchUserRace,
    fetchPolicy: 'cache-first',
  });

  const {
    removeFromEquipmentsMutation,
    addToEquipmentsMutation,
    removeAllUserEquipmentsMutation,
    loading: equipmentsLoading,
  } = useUserEquipments();

  const selectedClassId = userClassData?.user?.class?.id || '';
  const selectedRaceId = userRaceData?.user?.race?.id || '';

  useEffect(() => {
    classVar(selectedClassId);
  }, [selectedClassId]);

  useEffect(() => {
    raceVar(selectedRaceId);
  }, [selectedRaceId]);

  useEffect(() => {
    if (scoreData?.getArrayScores) {
      const mappedScores = new Map(scoreData.getArrayScores.map((item) => [item.ability.name, item.score]));
      abilitiesVar(mappedScores);
    }
  }, [scoreData]);

  const classes = useMemo(() => fetchedClasses || [], [fetchedClasses]);
  const races = useMemo(() => fetchedRaces || [], [fetchedRaces]);

  const checkUser = useCallback(
    (message: string) => {
      if (!userId) {
        const error = new UserNotFound(`User not logged in. Please log in to update ${message}.`);
        handleError(error, `You must be logged in to update ${message}`, 'warning', showToast);
        return false;
      }
      return true;
    },
    [showToast, userId]
  );

  const addToEquipments = async (equipment: Equipment) => {
    try {
      await addToEquipmentsMutation(equipment.id);
    } catch (error) {
      handleError(error, 'Error adding equipment', 'critical', showToast);
    }
  };

  const removeFromEquipments = async (equipment: Equipment) => {
    try {
      await removeFromEquipmentsMutation(equipment.id);
    } catch (error) {
      handleError(error, 'Error removing equipment', 'critical', showToast);
    }
  };

  const removeAllEquipments = async () => {
    try {
      await removeAllUserEquipmentsMutation();
    } catch (error) {
      handleError(error, 'Error removing all equipment', 'critical', showToast);
    }
  };
  const [updateAbilityScoresMutation] = useMutation(UPDATE_ABILITY_SCORES, {
    update: (cache, { data }) => {
      if (!data) return;

      const updatedScores = data.updateAbilityScores.abilityScores;

      cache.writeQuery({
        query: GET_ARRAY_SCORES,
        variables: { userId },
        data: {
          getArrayScores: updatedScores,
        },
      });
    },
  });
  const [updateUserClassMutation] = useMutation(UPDATE_USER_CLASS, {
    update: (cache, { data }) => {
      if (!data) return;
      const existing = cache.readQuery<UserClass>({
        query: GET_USER_CLASS,
        variables: { userId },
      });
      if (existing?.user) {
        cache.writeQuery({
          query: GET_USER_CLASS,
          variables: { userId },
          data: {
            user: {
              __typename: 'User',
              id: userId,
              class: {
                ...data.updateUserClass.class,
              },
            },
          },
        });
      }
    },
  });

  const [updateUserRaceMutation] = useMutation(UPDATE_USER_RACE, {
    update: (cache, { data }) => {
      if (!data) return;
      const existing = cache.readQuery<UserRace>({
        query: GET_USER_RACE,
        variables: { userId },
      });
      if (existing?.user) {
        cache.writeQuery({
          query: GET_USER_RACE,
          variables: { userId },
          data: {
            user: {
              __typename: 'User',
              id: userId,
              race: {
                ...data.updateUserRace.race,
              },
            },
          },
        });
      }
    },
  });

  const updateAbilityScores = useCallback(
    async (newValue: number, name: string) => {
      if (!checkUser('abilities')) return;

      try {
        const updatedScores = new Map(abilitiesVar());
        updatedScores.set(name, newValue);

        await updateAbilityScoresMutation({
          variables: { userId, scores: Array.from(updatedScores.values()) },
        });

        abilitiesVar(updatedScores);
      } catch (error) {
        handleError(error, 'Failed to update ability scores', 'critical', showToast);
      }
    },
    [checkUser, updateAbilityScoresMutation, showToast, userId]
  );

  const updateClass = async (classId: string) => {
    if (!checkUser('class')) return;

    try {
      const response = await updateUserClassMutation({ variables: { userId, classId } });
      classVar(classId);
      showToast({
        message: `Class changed to ${response.data.updateUserClass.class.name}`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      handleError(error, 'Failed to update class', 'critical', showToast);
    }
  };

  const updateRace = async (raceId: string) => {
    if (!checkUser('race')) return;

    try {
      const response = await updateUserRaceMutation({ variables: { userId, raceId } });
      raceVar(raceId);
      showToast({
        message: `Race changed to ${response.data.updateUserRace.race.name}`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      handleError(error, 'Failed to update race', 'critical', showToast);
    }
  };

  const loadingStates = {
    abilityScoresLoading,
    classLoading,
    raceLoading,
    equipmentsLoading,
  };

  return (
    <CharacterContext.Provider
      value={{
        stateAbilities: dataAbilities,
        userAbilityScores: abilityScores,
        updateAbilityScores,
        classes,
        updateClass,
        races,
        updateRace,
        addToEquipments,
        removeFromEquipments,
        removeAllEquipments,
        loadingStates,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};
