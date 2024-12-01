import { createContext, ReactNode, useCallback, useMemo } from 'react';

import { makeVar, useReactiveVar } from '@apollo/client';
import useDungeon from '../hooks/useDungeon.ts';
import { useToast } from '../hooks/useToast.ts';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';
import { handleError } from '../utils/handleError.ts';
import { UserNotFound } from '../utils/UserNotFound.ts';

interface DungeonContextType {
  dungeonMonsters: MonsterCardProps[];
  toggleDungeon: (monster: MonsterCardProps) => void;
  isInDungeon: (monsterIndex: string) => boolean;
}

interface DungeonProviderProps {
  children: ReactNode;
  userId: string;
}

export const dungeonMonstersVar = makeVar<MonsterCardProps[]>([]);

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  toggleDungeon: () => {},
  isInDungeon: () => false,
});

export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const maxFavorites = 6;
  const { showToast } = useToast();

  const { dungeonMonsters, toggleFavorite, favoritesError } = useDungeon();
  if (favoritesError) {
    handleError(favoritesError, 'Failed to load favorite monsters. Please try again later.', 'critical', showToast);
  }

  const currentDungeonMonsters = useReactiveVar(dungeonMonstersVar);

  const isInDungeon = useCallback(
    (monsterId: string) => {
      return currentDungeonMonsters.some((favMonster) => favMonster.id === monsterId);
    },
    [currentDungeonMonsters]
  );
  const toggleDungeon = async (monster: MonsterCardProps) => {
    if (!userId) {
      const error = new UserNotFound('User not logged in. Please log in to access this feature');
      handleError(error, 'You must be logged in to add monsters to your dungeon.', 'warning', showToast);
      return;
    }

    if (!isInDungeon(monster.id) && dungeonMonsters.length >= maxFavorites) {
      showToast({ message: 'You can only add 6 monsters to your dungeon', type: 'warning', duration: 3000 });
      return;
    }

    const wasInDungeon = isInDungeon(monster.id);

    try {
      await toggleFavorite(monster);
      if (wasInDungeon) {
        showToast({
          message: `${monster.name} removed from dungeon`,
          type: 'info',
          duration: 5000,
          undoAction: () => undoRemoveMonster(monster),
        });
      } else {
        showToast({
          message: `${monster.name} added to dungeon`,
          type: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      handleError(error, 'Failed to toggle dungeon monster. Please try again later.', 'critical', showToast);
    }
  };

  const undoRemoveMonster = async (monster: MonsterCardProps) => {
    try {
      await toggleFavorite(monster);
      showToast({
        message: `${monster.name} restored to dungeon`,
        type: 'success',
        duration: 3000,
      });
      console.log('After undo: ', dungeonMonstersVar());
    } catch (error) {
      handleError(error, 'Failed to restore monster. Please try again.', 'critical', showToast);
    }
  };

  const value = useMemo(
    () => ({
      dungeonMonsters: currentDungeonMonsters,
      toggleDungeon,
      isInDungeon,
    }),
    [currentDungeonMonsters, toggleDungeon, isInDungeon]
  );

  return <DungeonContext.Provider value={value}>{children}</DungeonContext.Provider>;
};
