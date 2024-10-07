import { createContext, useState, useEffect, ReactNode } from 'react';

export interface MonsterData {
  name: string;
  type: string;
  alignment: string;
  hp: number;
  size: string;
}

interface DungeonContextType {
  dungeonMonsters: MonsterData[];
  toggleDungeon: (monsterName: MonsterData) => void;
  isInDungeon: (monsterName: string) => boolean;
}

export const DungeonContext = createContext<DungeonContextType>({
  dungeonMonsters: [],
  toggleDungeon: () => {},
  isInDungeon: () => false,
});

export const DungeonProvider = ({ children }: { children: ReactNode }) => {
  const initializeDungeon = () => {
    const savedDungeon = localStorage.getItem('dungeonMonsters');
    return savedDungeon ? JSON.parse(savedDungeon) : [];
  };

  const [dungeonMonsters, setDungeonMonsters] = useState<MonsterData[]>(initializeDungeon);

  useEffect(() => {
    localStorage.setItem('dungeonMonsters', JSON.stringify(dungeonMonsters));
  }, [dungeonMonsters]);

  const toggleDungeon = (monster: MonsterData) => {
    setDungeonMonsters((prev) => {
      const isAlreadyInDungeon = prev.some((m) => m.name === monster.name);

      if (isAlreadyInDungeon) {
        return prev.filter((m) => m.name !== monster.name);
      } else if (prev.length < 6) {
        return [...prev, monster];
      }
      return prev;
    });
  };

  const isInDungeon = (monsterName: string) => {
    return dungeonMonsters.some((monster) => monster.name === monsterName);
  };

  return (
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};
