import { useMutation, useQuery } from '@apollo/client';
import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import {
  ADD_FAVORITE_MONSTER,
  GET_USER_FAVORITES,
  REMOVE_FAVORITE_MONSTER,
} from '../../../backend/src/graphql/queries.ts';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';
import MonsterDataProps from '../interfaces/MonsterDataProps.ts';
import { useToast } from './useToast';

interface Action {
  monster: MonsterCardProps;
  action: 'add' | 'remove';
  timestamp: number;
}

interface DungeonContextType {
  dungeonMonsters: MonsterCardProps[];
  toggleDungeon: (monster: MonsterCardProps) => void;
  isInDungeon: (monsterId: string) => boolean;
}

interface DungeonProviderProps {
  children: ReactNode;
  userId: string;
}

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  toggleDungeon: () => {},
  isInDungeon: () => false,
});

export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const [dungeonMonsters, setDungeonMonsters] = useState<MonsterCardProps[]>([]);
  const [addFavoriteMonster] = useMutation(ADD_FAVORITE_MONSTER);
  const [removeFavoriteMonster] = useMutation(REMOVE_FAVORITE_MONSTER);
  const maxFavorites = 6;
  const actionsRef = useRef<Action[]>([]); // tracks all actions (undo etc)
  const { showToast } = useToast();

  const { data } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data?.user?.favoritedMonsters) {
      const transformedMonsters = data.user.favoritedMonsters
        .map((monster: MonsterDataProps) => {
          if (
            !monster.id ||
            !monster.name ||
            !monster.size ||
            !monster.type ||
            monster.hit_points === undefined ||
            !monster.image
          ) {
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
        })
        .filter(Boolean);
      setDungeonMonsters(transformedMonsters);
    }
  }, [data]);

  const addAction = (action: Action) => {
    actionsRef.current = [action, ...actionsRef.current.slice(0, 4)]; // keep last 5 actions in array
  };

  const isInDungeon = (monsterId: string) => {
    return dungeonMonsters.some((monster) => monster.id === monsterId);
  };

  const handleUndo = (monster: MonsterCardProps) => {
    const actionIndex = actionsRef.current.findIndex((action) => action.monster.id === monster.id);
    if (actionIndex !== -1) {
      const { action } = actionsRef.current[actionIndex];
      setDungeonMonsters((prev) => {
        if (action === 'remove') {
          return [...prev, monster];
        } else {
          return prev.filter((m) => m.id !== monster.id);
        }
      });
      actionsRef.current = actionsRef.current.filter((_, index) => index !== actionIndex);
      const undoMessage =
        action === 'remove'
          ? `${monster.name} has been restored to the dungeon`
          : `Canceled adding ${monster.name} to dungeon`;
      showToast({
        message: undoMessage,
        type: 'success',
        duration: 3000,
      });
    }
  };

  const toggleDungeon = async (monster: MonsterCardProps) => {
    if (!isInDungeon(monster.id) && dungeonMonsters.length >= maxFavorites) {
      showToast({
        message: 'Only 6 monsters allowed in dungeon!',
        type: 'warning',
        duration: 2000,
      });
      return;
    }
    try {
      if (isInDungeon(monster.id)) {
        await removeFavoriteMonster({ variables: { userId, monsterId: monster.id } });
        setDungeonMonsters((prev) => prev.filter((m) => m.id !== monster.id));
        addAction({ monster, action: 'remove', timestamp: Date.now() });
        showToast({
          message: `${monster.name} was removed from dungeon`,
          type: 'info',
          undoAction: () => handleUndo(monster),
        });
      } else {
        await addFavoriteMonster({ variables: { userId, monsterId: monster.id } });
        setDungeonMonsters((prev) => [...prev, monster]);
        addAction({ monster, action: 'add', timestamp: Date.now() });
        showToast({
          message: `${monster.name} was added to dungeon`,
          type: 'info',
          undoAction: () => handleUndo(monster),
        });
      }
    } catch (error) {
      console.error('Error in toggleDungeon:', error);
    }
  };

  return (
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};
