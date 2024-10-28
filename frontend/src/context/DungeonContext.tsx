import { createContext, ReactNode, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_FAVORITE_MONSTER,
  REMOVE_FAVORITE_MONSTER,
  GET_USER_FAVORITES,
} from '../../../backend/src/graphql/queries.ts';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';

interface DungeonContextType {
  dungeonMonsters: MonsterCardProps[];
  toggleDungeon: (monster: MonsterCardProps) => void;
  isInDungeon: (monsterIndex: string) => boolean;
}

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  toggleDungeon: () => {
  },
  isInDungeon: () => false,
});

interface DungeonProviderProps {
  children: ReactNode;
  userId: string;
}

export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const [dungeonMonsters, setDungeonMonsters] = useState<MonsterCardProps[]>([]);
  const [addFavoriteMonster] = useMutation(ADD_FAVORITE_MONSTER);
  const [removeFavoriteMonster] = useMutation(REMOVE_FAVORITE_MONSTER);

  const { data, refetch } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data?.user?.favoritedMonsters) {
      setDungeonMonsters(data.user.favoritedMonsters);
    }
  }, [data]);

  const toggleDungeon = async (monster: MonsterCardProps) => {
    const monsterId = monster.id;
    if (isInDungeon(monsterId)) {
      await removeFavoriteMonster({ variables: { userId, monsterId: monsterId } });
    } else {
      await addFavoriteMonster({ variables: { userId, monsterId: monsterId } });
    }
    await refetch();
    console.log('Current dungeonMonsters after toggle:', dungeonMonsters);
  };

  const isInDungeon = (monsterId: string) => dungeonMonsters.some((monster) => monster.id === monsterId);

  return (
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};