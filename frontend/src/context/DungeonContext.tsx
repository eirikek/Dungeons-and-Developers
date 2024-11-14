import { createContext, ReactNode, useRef, useState } from 'react';

import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';
import { useToast } from '../hooks/useToast.ts';
import useDungeonMonsters from '../hooks/useDungeonMonsters.ts';

interface DungeonContextType {
  dungeonMonsters: MonsterCardProps[];
  thisDungeonName: string;
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
  thisDungeonName: '',
  toggleDungeon: () => {},
  isInDungeon: () => false,
  undoRemoveMonster: () => {},
  updateDungeonName: () => {},
});

export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const maxFavorites = 6;
  const undoRemoveRef = useRef<MonsterCardProps | null>(null);
  const { showToast } = useToast();

  const { dungeonMonsters, dungeonName, toggleFavorite, toggleDungeonName } = useDungeonMonsters();
  const [thisDungeonName, setDungeonName] = useState(dungeonName);
  const isInDungeon = (monsterId: string) => dungeonMonsters.some((favMonster) => favMonster.id === monsterId);

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
      await toggleFavorite(monster);
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
    await toggleDungeonName(newName);
    setDungeonName(newName);
  };

  const undoRemoveMonster = async () => {
    if (undoRemoveRef.current) {
      const monster = undoRemoveRef.current;
      undoRemoveRef.current = null;
      await toggleFavorite(monster);
      showToast({
        message: `${monster.name} restored to dungeon`,
        type: 'success',
        duration: 3000,
      });
    }
  };

  return (
    <DungeonContext.Provider
      value={{ dungeonMonsters, thisDungeonName, toggleDungeon, isInDungeon, undoRemoveMonster, updateDungeonName }}
    >
      {children}
    </DungeonContext.Provider>
  );
};
