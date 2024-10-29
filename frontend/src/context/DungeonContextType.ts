import { createContext } from 'react';
import { MonsterCardDataProps } from '../hooks/useMonster';

export interface DungeonContextType {
  dungeonMonsters: MonsterCardDataProps[];
  toggleDungeon: (monster: MonsterCardDataProps) => void;
  isInDungeon: (monsterIndex: string) => boolean;
}

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  toggleDungeon: () => {},
  isInDungeon: () => false,
});
