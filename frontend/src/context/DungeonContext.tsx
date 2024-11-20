import { createContext, ReactNode, useCallback } from 'react';

import { makeVar, useReactiveVar } from '@apollo/client';
import useDungeon from '../hooks/useDungeon.ts';
import { useToast } from '../hooks/useToast.ts';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';

interface DungeonContextType {
  dungeonMonsters: MonsterCardProps[];
  dungeonName: string;
  toggleDungeon: (monster: MonsterCardProps) => void;
  isInDungeon: (monsterIndex: string) => boolean;
  updateDungeonName: (newName: string) => void;
}

interface DungeonProviderProps {
  children: ReactNode;
  userId: string;
}

export const dungeonMonstersVar = makeVar<MonsterCardProps[]>([]);

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  dungeonName: '',
  toggleDungeon: () => {},
  isInDungeon: () => false,
  updateDungeonName: () => {},
});

export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const maxFavorites = 6;
  const { showToast } = useToast();

  const { dungeonMonsters, dungeonName, toggleFavorite, toggleDungeonName } = useDungeon();

  const currentDungeonMonsters = useReactiveVar(dungeonMonstersVar);

  const isInDungeon = useCallback(
    (monsterId: string) => {
      return currentDungeonMonsters.some((favMonster) => favMonster.id === monsterId);
    },
    [currentDungeonMonsters]
  );
  const toggleDungeon = async (monster: MonsterCardProps) => {
    if (!userId) {
      showToast({ message: 'You must be logged in to add monsters to dungeon', type: 'error', duration: 3000 });
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
      console.error('Error in toggleDungeon:', error);
    }
  };

  const updateDungeonName = async (newName: string) => {
    try {
      await toggleDungeonName(newName);
      showToast({
        message: `Dungeon name updated to "${newName}"`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating dungeon name:', error);
      showToast({
        message: 'Failed to update dungeon name. Please try again.',
        type: 'error',
        duration: 3000,
      });
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
      console.error('Error restoring monster to dungeon:', error);
      showToast({
        message: 'Failed to restore monster. Please try again.',
        type: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <DungeonContext.Provider
      value={{
        dungeonMonsters: currentDungeonMonsters,
        dungeonName,
        toggleDungeon,
        isInDungeon,
        updateDungeonName,
      }}
    >
      {children}
    </DungeonContext.Provider>
  );
};
