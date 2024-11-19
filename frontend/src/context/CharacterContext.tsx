import { useMutation, useQuery } from '@apollo/client';
import { createContext, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  GET_ARRAY_SCORES,
  GET_USER_CLASS,
  GET_USER_RACE,
  UPDATE_ABILITY_SCORES,
  UPDATE_USER_CLASS,
  UPDATE_USER_RACE,
} from '../graphql/queries';
import useUserEquipments from '../hooks/useUserEquipments';
import { Equipment } from '../interfaces/EquipmentProps';
import { useToast } from '../hooks/useToast.ts';
import useAbilityScores from '../hooks/useAbilityScores.ts';
import useClasses from '../hooks/useClasses.ts';
import useRaces from '../hooks/useRaces.ts';
import ClassData from '../interfaces/ClassProps.ts';
import RaceData from '../interfaces/RaceProps.ts';
import abilityScoreMap from '../utils/abilityScoreMapping.ts';
import { abilitiesVar } from '../pages/mainPages/myCharacterPage.tsx';
import { classVar } from '../pages/subPages/classPage.tsx';
import { raceVar } from '../pages/subPages/racePage.tsx';
import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';
interface CharacterContextType {
  stateAbilities: AbilityScoreCardProps[];
  userAbilityScores: Map<string, number>;
  updateAbilityScores: (newValue: number, updatedAbilityName: string) => Promise<void>;
  classes: ClassData[];
  selectedClassId: string;
  updateClass: (classId: string) => Promise<void>;
  races: RaceData[];
  selectedRaceId: string;
  updateRace: (raceId: string) => Promise<void>;
  userEquipments: Equipment[];
  //loading: boolean;
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

export const CharacterContext = createContext<CharacterContextType>({
  stateAbilities: [],
  userAbilityScores: new Map<string, number>(),
  updateAbilityScores: async () => Promise.resolve(),
  classes: [],
  selectedClassId: '',
  updateClass: async () => Promise.resolve(),
  races: [],
  selectedRaceId: '',
  updateRace: async () => Promise.resolve(),
  userEquipments: [],
});

export const CharacterProvider = ({ children, userId }: CharacterProviderProps) => {
  const currentPage = 1;
  const classesPerPage = 12;
  const { showToast } = useToast();
  const { classes: fetchedClasses, totalClasses, loading: classesLoading } = useClasses(currentPage, classesPerPage);
  const { races: fetchedRaces, loading: racesLoading } = useRaces(1, 12);

  const [abilityScores, setAbilityScores] = useState<Map<string, number>>(new Map());

  const { userEquipments, loading: equipmentsLoading } = useUserEquipments();
  const { abilities: dataAbilities, totalAbilities } = useAbilityScores(1, 6);

  const {
    data: scoreData,
    loading: scoreLoading,
    error: scoreError,
  } = useQuery<ArrayScores, ArrayVar>(GET_ARRAY_SCORES, {
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
  const selectedClassId = userClassData?.user?.class?.id || '';
  const selectedRaceId = userRaceData?.user?.race?.id || '';

  useEffect(() => {
    abilitiesVar(abilityScores);
    console.log('reactive var: ', abilitiesVar());
  }, [abilityScores]);

  useEffect(() => {
    classVar(selectedClassId);
  }, [selectedClassId]);

  useEffect(() => {
    raceVar(selectedRaceId);
  }, [selectedRaceId]);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [races, setRaces] = useState<RaceData[]>([]);

  useEffect(() => {
    if (fetchedClasses) {
      setClasses(fetchedClasses);
    }
  }, [fetchedClasses]);

  useEffect(() => {
    if (fetchedRaces) {
      setRaces(fetchedRaces);
    }
  }, [fetchedRaces]);

  const checkUser = (message: string) => {
    if (!userId) {
      showToast({
        message: `You must be logged in to change ${message}`,
        type: 'error',
        duration: 5000,
      });
      return false;
    }
    return true;
  };

  const mappedScores = useMemo(() => {
    return new Map(scoreData?.getArrayScores.map((item: AbilityScorePair) => [item.ability.name, item.score]) || []);
  }, [scoreData?.getArrayScores]);

  useEffect(() => {
    setAbilityScores(mappedScores);
  }, [mappedScores]);

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
        query: GET_USER_CLASS,
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

  const saveScores = async () => {
    const scores = Object.keys(abilityScoreMap).map((key) => abilityScores.get(key) ?? 0);
    await updateAbilityScoresMutation({ variables: { userId, scores } });
  };

  const updateAbilityScores = async (newValue: number, name: string) => {
    if (!checkUser('Abilities')) return;

    try {
      setAbilityScores((prevScores) => {
        const updatedScores = new Map(prevScores);
        updatedScores.set(name, newValue); // Update only the specific ability
        return updatedScores;
      });

      debounceSaveAndToast(name);
    } catch (error) {
      showToast({
        message: `Failed to update ability scores: ${error}`,
        type: 'error',
        duration: 3000,
      });
    }
  };

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const debounceSaveAndToast = (abilityName: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        await saveScores();

        showToast({
          message: `Ability scores updated successfully (${abilityName})!`,
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        showToast({
          message: `Failed to update ability scores: ${error}`,
          type: 'error',
          duration: 3000,
        });
      } finally {
        debounceTimeout.current = null;
      }
    }, 500);
  };

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
      raceVar(raceId); // Update reactive variable
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

  // const loading = scoreLoading || classLoading || raceLoading || equipmentsLoading;

  return (
    <CharacterContext.Provider
      value={{
        stateAbilities: dataAbilities,
        userAbilityScores: abilityScores,
        updateAbilityScores,
        classes,
        selectedClassId,
        updateClass,
        races,
        selectedRaceId,
        updateRace,
        userEquipments,
        // loading,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};
