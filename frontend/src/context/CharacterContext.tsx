import { makeVar, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { createContext, ReactNode, useCallback, useEffect, useMemo } from 'react';

import { UPDATE_ABILITY_SCORES, UPDATE_USER_CLASS, UPDATE_USER_RACE } from '../graphql/updateUserQueries.ts';
import { GET_ARRAY_SCORES, GET_USER_CLASS, GET_USER_RACE } from '../graphql/userQueries.ts';
import useAbilityScores from '../hooks/useAbilityScores.ts';
import useClasses from '../hooks/useClasses.ts';
import useRaces from '../hooks/useRaces.ts';
import { useToast } from '../hooks/useToast.ts';
import useUserEquipments from '../hooks/useUserEquipments';
import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';
import ClassData from '../interfaces/ClassProps.ts';
import { Equipment } from '../interfaces/EquipmentProps';
import RaceData from '../interfaces/RaceProps.ts';
import { abilitiesVar } from '../pages/mainPages/myCharacterPage.tsx';
import { classVar } from '../pages/subPages/classPage.tsx';
import { raceVar } from '../pages/subPages/racePage.tsx';
import { notifyScoreChanges } from '../utils/abilityScoreMapping.ts';

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

interface UserClass {
  user: {
    id: string;
    class: {
      id: string;
      name: string;
      index: string;
      hit_die: number;
    };
  };
}

interface UserRace {
  user: {
    id: string;
    race: {
      id: string;
      name: string;
      speed: number;
      alignment: string;
      size: string;
      img: string;
    };
  };
}
interface UserAbilities {
  user: {
    id: string;
    abilityScores: {
      ability: {
        id: string;
        name: string;
      };
      score: number;
    };
  };
}
interface Ability {
  id: string;
  name: string;
}

interface AbilityScorePair {
  __typename: string;
  ability: Ability;
  score: number;
}

interface ArrayScores {
  getArrayScores: AbilityScorePair[];
}

type ArrayVar = {
  userId: string;
};

export const equipmentsVar = makeVar<Equipment[]>([]);

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

  const currentEquipments = useReactiveVar(equipmentsVar);

  const { classes: fetchedClasses } = useClasses(1, 12);
  const { races: fetchedRaces } = useRaces(1, 12);
  const { abilities: dataAbilities } = useAbilityScores(1, 6);

  const { data: scoreData, loading: abilityScoresLoading } = useQuery<ArrayScores, ArrayVar>(GET_ARRAY_SCORES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: userClassData, loading: classLoading } = useQuery(GET_USER_CLASS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: userRaceData, loading: raceLoading } = useQuery(GET_USER_RACE, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const abilityScores = useReactiveVar(abilitiesVar);

  const {
    userEquipments,
    removeFromEquipmentsMutation,
    addToEquipmentsMutation,
    removeAllUserEquipmentsMutation,
    loading: equipmentsLoading,
  } = useUserEquipments();

  const selectedClassId = userClassData?.user?.class?.id || '';
  const selectedRaceId = userRaceData?.user?.race?.id || '';

  useEffect(() => {
    equipmentsVar(userEquipments);
  }, [currentEquipments, userEquipments]);

  useEffect(() => {
    classVar(selectedClassId);
  }, [selectedClassId]);

  useEffect(() => {
    raceVar(selectedRaceId);
  }, [selectedRaceId]);

  useEffect(() => {
    if (scoreData?.getArrayScores) {
      const mappedScores = new Map(
        scoreData.getArrayScores.map((item: AbilityScorePair) => [item.ability.name, item.score])
      );
      abilitiesVar(mappedScores);
    }
  }, [scoreData]);

  const classes = useMemo(() => fetchedClasses || [], [fetchedClasses]);
  const races = useMemo(() => fetchedRaces || [], [fetchedRaces]);

  const checkUser = useCallback(
    (message: string) => {
      if (!userId) {
        showToast({
          message: `You must be logged in to change ${message}`,
          type: 'error',
          duration: 5000,
        });
        return false;
      }
      return true;
    },
    [showToast, userId]
  );

  const addToEquipments = async (equipment: Equipment) => {
    try {
      await addToEquipmentsMutation(equipment.id);
      equipmentsVar([...equipmentsVar(), equipment]);
    } catch (error) {
      console.error('Error adding equipment:', error);
    }
  };

  const removeFromEquipments = async (equipment: Equipment) => {
    try {
      await removeFromEquipmentsMutation(equipment.id);

      equipmentsVar(equipmentsVar().filter((equip) => equip.id !== equipment.id));
    } catch (error) {
      console.error('Error removing equipment:', error);
    }
  };

  const removeAllEquipments = async () => {
    try {
      await removeAllUserEquipmentsMutation();
      equipmentsVar([]);
    } catch (error) {
      console.error('Error removing all equipment:', error);
    }
  };

  const [updateAbilityScoresMutation] = useMutation(UPDATE_ABILITY_SCORES, {
    update: (cache, { data }) => {
      if (!data) return;

      const existing = cache.readQuery<UserAbilities>({
        query: GET_ARRAY_SCORES,
        variables: { userId },
      });

      if (existing?.user) {
        cache.writeQuery({
          query: GET_ARRAY_SCORES,
          variables: { userId },
          data: {
            user: {
              __typename: 'User',
              id: userId,
              abilityScores: {
                ...existing?.user.abilityScores.ability,
                score: data.user.score,
              },
            },
          },
        });
      }
    },
    onError: (error) => {
      console.error('Failed to update ability scores: ', error);

      showToast({
        message: `Failed to update ability scores: ${error.message}`,
        type: 'error',
        duration: 3000,
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
      if (!checkUser('Abilities')) return;

      const updatedScores = new Map(abilitiesVar());
      updatedScores.set(name, newValue);

      try {
        const scoresArray = Array.from(updatedScores.values());

        await updateAbilityScoresMutation({
          variables: { userId, scores: scoresArray },
        });

        abilitiesVar(updatedScores);
        notifyScoreChanges(updatedScores, abilitiesVar(), abilitiesVar, showToast);
      } catch (error) {
        console.error(error);
      }
    },
    [checkUser, showToast, updateAbilityScoresMutation, userId]
  );

  const updateClass = async (classId: string) => {
    if (!checkUser('Class')) return;

    try {
      const response = await updateUserClassMutation({ variables: { userId, classId } });
      classVar(classId);
      const updatedClass = response.data.updateUserClass.class;
      showToast({
        message: `Class changed to ${updatedClass.name}`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      showToast({
        message: `Failed to update class: ${error}`,
        type: 'error',
        duration: 3000,
      });
    }
  };

  const updateRace = async (raceId: string) => {
    if (!checkUser('Race')) return;

    try {
      const response = await updateUserRaceMutation({ variables: { userId, raceId } });
      raceVar(raceId);
      const updatedRace = response.data.updateUserRace.race;

      showToast({
        message: `Race changed to ${updatedRace.name}`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating race:', error);
      showToast({
        message: 'Failed to update race. Please try again.',
        type: 'error',
        duration: 3000,
      });
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
