import { useCallback, useEffect, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import useDungeon from '../hooks/useDungeon.ts';
import { useToast } from '../hooks/useToast.ts';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';
import { dungeonMonstersVar } from '../utils/apolloVars.ts';
import { handleError } from '../utils/handleError.ts';
import { UserNotFound } from '../utils/UserNotFound.ts';
import { DungeonProviderProps } from '../interfaces/DungeonContextProps.ts';
import { DungeonContext } from './DungeonContext.ts';

export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const maxFavorites = 6;
  const { showToast } = useToast();
  const { dungeonMonsters, toggleFavorite, favoritesError } = useDungeon();

  useEffect(() => {
    if (favoritesError) {
      handleError(favoritesError, 'Failed to load favorite monsters. Please try again later.', 'critical', showToast);
    }
  }, [favoritesError, showToast]);

  const currentDungeonMonsters = useReactiveVar(dungeonMonstersVar);

  const isInDungeon = useCallback(
    (monsterId: string) => {
      return currentDungeonMonsters.some((favMonster) => favMonster.id === monsterId);
    },
    [currentDungeonMonsters]
  );

  const undoRemoveMonster = useCallback(
    async (monster: MonsterCardProps) => {
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
    },
    [showToast, toggleFavorite]
  );

  const toggleDungeon = useCallback(
    async (monster: MonsterCardProps) => {
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
    },
    [dungeonMonsters.length, isInDungeon, showToast, toggleFavorite, undoRemoveMonster, userId]
  );

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
