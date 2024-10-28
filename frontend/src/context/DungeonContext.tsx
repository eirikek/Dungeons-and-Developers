import { createContext, ReactNode, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_FAVORITE_MONSTER,
  REMOVE_FAVORITE_MONSTER,
  GET_USER_FAVORITES,
} from '../../../backend/src/graphql/queries.ts';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';
import MonsterDataProps from '../interfaces/MonsterDataProps.ts';

interface DungeonContextType {
  dungeonMonsters: MonsterCardProps[];
  toggleDungeon: (monster: MonsterCardProps) => void;
  isInDungeon: (monsterIndex: string) => boolean;
}

interface DungeonProviderProps {
  children: ReactNode;
  userId: string;
}

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  toggleDungeon: () => {
  },
  isInDungeon: () => false,
});


export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const [dungeonMonsters, setDungeonMonsters] = useState<MonsterCardProps[]>([]);
  const [addFavoriteMonster] = useMutation(ADD_FAVORITE_MONSTER);
  const [removeFavoriteMonster] = useMutation(REMOVE_FAVORITE_MONSTER);
  const maxFavorites = 6;

  const { data } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data?.user?.favoritedMonsters) {
      const transformedMonsters = data.user.favoritedMonsters.map((monster: MonsterDataProps) => {
        if (!monster.id || !monster.name || !monster.size || !monster.type || monster.hit_points === undefined || !monster.image) {
          return null;
        }

        return {
          id: monster.id,
          name: monster.name,
          size: monster.size,
          type: monster.type,
          alignment: monster.alignment,
          hp: monster.hit_points,
          img: monster.image,
        };
      }).filter(Boolean);

      setDungeonMonsters(transformedMonsters);
    }
  }, [data]);

  const toggleDungeon = async (monster: MonsterCardProps) => {
    if (!isInDungeon(monster.id) && dungeonMonsters.length >= maxFavorites) {
      return;
    }

    try {
      if (isInDungeon(monster.id)) {
        await removeFavoriteMonster({ variables: { userId, monsterId: monster.id } });
        setDungeonMonsters((prev) =>
          prev.filter((m) => m.id !== monster.id),
        );
      } else {
        await addFavoriteMonster({ variables: { userId, monsterId: monster.id } });
        setDungeonMonsters((prev) => [...prev, monster]);
      }
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