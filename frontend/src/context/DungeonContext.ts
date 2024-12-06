import { createContext, useContext } from 'react';
import { DungeonContextType } from '../interfaces/DungeonContextProps.ts';

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  toggleDungeon: () => {},
  isInDungeon: () => false,
});

export const useDungeonContext = () => {
  const context = useContext(DungeonContext);
  if (!context) {
    throw new Error('useDungeonContext must be used within a DungeonProvider');
  }
  return context;
};
