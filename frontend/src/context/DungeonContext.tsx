import { createContext, useState, useEffect, ReactNode } from 'react';

interface DungeonContextType {
  dungeonMonsters: string[];
  toggleDungeon: (monsterName: string) => void;
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

  const [dungeonMonsters, setDungeonMonsters] = useState<string[]>(initializeDungeon);

  useEffect(() => {
    localStorage.setItem('dungeonMonsters', JSON.stringify(dungeonMonsters));
  }, [dungeonMonsters]);

  const toggleDungeon = (monsterName: string) => {
    setDungeonMonsters((prev) =>
      prev.includes(monsterName)
        ? prev.filter((name) => name !== monsterName)
        : prev.length < 6
        ? [...prev, monsterName]
        : prev
    );
  };

  const isInDungeon = (monsterName: string) => {
    return dungeonMonsters.includes(monsterName);
  };

  return (
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};
