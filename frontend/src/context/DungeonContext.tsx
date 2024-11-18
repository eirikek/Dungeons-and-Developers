import { createContext, ReactNode, useCallback, useRef } from 'react';

import MonsterGraphQL from 'src/interfaces/MonsterDataProps.ts';
import useDungeon from '../hooks/useDungeon.ts';
import { useToast } from '../hooks/useToast.ts';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';

interface DungeonContextType {
  dungeonMonsters: MonsterCardProps[];
  dungeonName: string;
  toggleDungeon: (monster: MonsterCardProps) => void;
  isInDungeon: (monsterIndex: string) => boolean;
  undoRemoveMonster: () => void;
  updateDungeonName: (newName: string) => void;
}

interface DungeonProviderProps {
  children: ReactNode;
  userId: string;
}

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  dungeonName: '',
  toggleDungeon: () => {},
  isInDungeon: () => false,
  undoRemoveMonster: () => {},
  updateDungeonName: () => {},
});

export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const maxFavorites = 6;
  const undoRemoveRef = useRef<MonsterCardProps | null>(null);
  const { showToast } = useToast();

  const { dungeonMonsters, dungeonName, toggleFavorite, toggleDungeonName } = useDungeon();

  const isInDungeon = useCallback(
    (monsterId: string) => {
      return dungeonMonsters.some((favMonster: MonsterGraphQL) => favMonster.id === monsterId);
    },
    [dungeonMonsters]
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

    try {
      await toggleFavorite(monster, false);
      if (isInDungeon(monster.id)) {
        undoRemoveRef.current = monster;
        showToast({
          message: `${monster.name} removed from dungeon`,
          type: 'info',
          duration: 5000,
          undoAction: undoRemoveMonster,
        });
      } else {
        undoRemoveRef.current = null;
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

  const undoRemoveMonster = async () => {
    console.log('Before undo: ', dungeonMonsters);
    if (undoRemoveRef.current) {
      const monster = undoRemoveRef.current;
      if (!isInDungeon(monster.id)) {
        try {
          await toggleFavorite(monster, true);
          undoRemoveRef.current = null;
          showToast({
            message: `${monster.name} restored to dungeon`,
            type: 'success',
            duration: 3000,
          });
          console.log('After undo: ', dungeonMonsters);
        } catch (error) {
          console.error('Error restoring monster to dungeon:', error);
          showToast({
            message: 'Failed to restore monster. Please try again.',
            type: 'error',
            duration: 3000,
          });
        }
      }
    }
  };

  return (
    <DungeonContext.Provider
      value={{
        dungeonMonsters,
        dungeonName,
        toggleDungeon,
        isInDungeon,
        undoRemoveMonster,
        updateDungeonName,
      }}
    >
      {children}
    </DungeonContext.Provider>
  );
};
