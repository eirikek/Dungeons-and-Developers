import { MonsterCardProps } from './MonsterCardProps.ts';
import { ReactNode } from 'react';

export interface DungeonContextType {
  dungeonMonsters: MonsterCardProps[];
  toggleDungeon: (monster: MonsterCardProps) => void;
  isInDungeon: (monsterIndex: string) => boolean;
}

export interface DungeonProviderProps {
  children: ReactNode;
  userId: string;
}
