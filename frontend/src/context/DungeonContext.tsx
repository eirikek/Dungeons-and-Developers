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

  const { data } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data?.user?.favoritedMonsters) {
      setDungeonMonsters(data.user.favoritedMonsters);
    }
  }, [data]);

  const toggleDungeon = async (monster: MonsterCardProps) => {
    console.log(`Toggling dungeon for monster with id: ${monster.id}`);

    try {
      if (isInDungeon(monster.id)) {
        console.log('Removing monster from dungeon:', monster);
        await removeFavoriteMonster({ variables: { userId, monsterId: monster.id } });

        setDungeonMonsters((prev) =>
          prev.filter((m) => m.id !== monster.id),
        );
      } else {
        console.log('Adding monster to dungeon:', monster);
        await addFavoriteMonster({ variables: { userId, monsterId: monster.id } });
        setDungeonMonsters((prev) => [...prev, monster]);
      }

      console.log('Dungeon monsters after direct update:', dungeonMonsters);
    } catch (error) {
      console.error('Error in toggleDungeon:', error);
    }
  };

  const isInDungeon = (monsterId: string) => dungeonMonsters.some((monster) => monster.id === monsterId);

  return (
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};