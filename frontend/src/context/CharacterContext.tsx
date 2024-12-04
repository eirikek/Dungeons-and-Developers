import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { createContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { UPDATE_ABILITY_SCORES, UPDATE_USER_CLASS, UPDATE_USER_RACE } from '../graphql/mutations/userMutations.ts';
import { GET_ARRAY_SCORES, GET_USER_CLASS, GET_USER_RACE } from '../graphql/queries/userQueries.ts';
import useAbilityScores from '../hooks/useAbilityScores.ts';
import useClasses from '../hooks/useClasses.ts';
import useRaces from '../hooks/useRaces.ts';
import { useToast } from '../hooks/useToast.ts';
import useUserEquipments from '../hooks/useUserEquipments';
import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';
import ClassData from '../interfaces/ClassProps.ts';
import { Equipment } from '../interfaces/EquipmentProps';
import RaceData from '../interfaces/RaceProps.ts';
import { abilitiesVar } from '../utils/apolloVars.ts';
import { classVar } from '../utils/apolloVars.ts';
import { raceVar } from '../utils/apolloVars.ts';
import { ArrayScores, ArrayVar, UserClass, UserRace } from '../graphql/queryInterface.ts';
import { UserNotFound } from '../utils/UserNotFound.ts';
import { handleError } from '../utils/handleError.ts';
//import { equipmentsVar } from '../utils/apolloVars.ts';

interface CharacterContextType {
  stateAbilities: AbilityScoreCardProps[];
  userAbilityScores: Map<string, number>;
  updateAbilityScores: (newValue: number, updatedAbilityName: string) => Promise<void>;
  classes: ClassData[];
  updateClass: (classId: string) => Promise<void>;
  races: RaceData[];
  updateRace: (raceId: string) => Promise<void>;
  addToEquipments: (equipment: Equipment) => void;
  removeFromEquipments: (equipment: Equipment) => void;
  removeAllEquipments: () => void;
  loadingStates: LoadingStates;
}

interface LoadingStates {
  abilityScoresLoading: boolean;
  classLoading: boolean;
  raceLoading: boolean;
  equipmentsLoading: boolean;
}

interface CharacterProviderProps {
  children: ReactNode;
  userId: string;
}

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
