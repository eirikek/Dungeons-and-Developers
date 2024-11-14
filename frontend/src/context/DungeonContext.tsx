import { createContext, ReactNode, useRef } from 'react';

import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';
import { useToast } from '../hooks/useToast.ts';
import useDungeonMonsters from '../hooks/useDungeonMonsters.ts';

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
  toggleDungeon: () => {},
  isInDungeon: () => false,
});

export const DungeonProvider = ({ children, userId }: DungeonProviderProps) => {
  const maxFavorites = 6;
  const undoRemoveRef = useRef<MonsterCardProps | null>(null);
  const { showToast } = useToast();

  const { dungeonMonsters, toggleFavorite } = useDungeonMonsters();

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
      undoRemoveRef.current = monster;
      showToast({
        message: isInDungeon(monster.id) ? `${monster.name} removed from dungeon` : `${monster.name} added to dungeon`,
        type: isInDungeon(monster.id) ? 'info' : 'success',
        duration: isInDungeon(monster.id) ? 5000 : 3000,
      });
    } catch (error) {
      console.error('Error in toggleDungeon:', error);
    }
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
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};
