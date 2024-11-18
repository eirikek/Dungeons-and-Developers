import { useMutation, useQuery } from '@apollo/client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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

interface CharacterContextType {
  abilityScores: number[];
  updateAbilityScores: (scores: number[]) => Promise<void>;
  selectedClassId: string;
  updateClass: (classId: string) => Promise<void>;
  selectedRaceId: string;
  updateRace: (raceId: string) => Promise<void>;
  userEquipments: Equipment[];
  loading: boolean;
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

export const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider = ({ children, userId }: CharacterProviderProps) => {
  const { data: scoreData, loading: scoreLoading } = useQuery(GET_ARRAY_SCORES, {
    variables: { userId },
    skip: !userId,
  });
  const { data: classData, loading: classLoading } = useQuery(GET_USER_CLASS, {
    variables: { userId },
    skip: !userId,
  });
  const { data: raceData, loading: raceLoading } = useQuery(GET_USER_RACE, {
    variables: { userId },
    skip: !userId,
  });

  const selectedClassId = classData?.user?.class?.id || '';
  const selectedRaceId = raceData?.user?.race?.id || '';

  const [abilityScores, setAbilityScores] = useState<number[]>([]);

  const { userEquipments, loading: equipmentsLoading, refetchEquipments } = useUserEquipments();

  useEffect(() => {
    if (scoreData?.getArrayScores) {
      setAbilityScores(scoreData.getArrayScores.map((score: any) => score.score));
    }
  }, [scoreData]);

  const [updateAbilityScoresMutation] = useMutation(UPDATE_ABILITY_SCORES, {
    update: (cache, { data }) => {
      cache.writeQuery({
        query: GET_ARRAY_SCORES,
        variables: { userId },
        data: {
          getArrayScores: data.updateAbilityScores,
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
                ...data.updateUserClass,
              },
            },
          },
        });
      }
    },
    refetchQueries: [{ query: GET_USER_CLASS, variables: { userId } }],
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
              ...existing?.user,
              race: data.race,
            },
          },
        });
      }
    },
  });

  useEffect(() => {
    if (scoreData?.getArrayScores) {
      setAbilityScores(scoreData.getArrayScores.map((score: any) => score.score));
    }
  }, [scoreData]);

  const updateAbilityScores = async (scores: number[]) => {
    await updateAbilityScoresMutation({ variables: { userId, scores } });
    setAbilityScores(scores);
  };

  const updateClass = async (classId: string) => {
    await updateUserClassMutation({ variables: { userId, classId } });
  };

  const updateRace = async (raceId: string) => {
    await updateUserRaceMutation({ variables: { userId, raceId } });
  };

  const loading = scoreLoading || classLoading || raceLoading || equipmentsLoading;

  return (
    <CharacterContext.Provider
      value={{
        abilityScores,
        updateAbilityScores,
        selectedClassId,
        updateClass,
        selectedRaceId,
        updateRace,
        userEquipments,
        loading,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};
