// src/tests/mocks/DungeonContextMock.tsx

import React, { useState } from 'react';
import { DungeonContext } from '../../src/context/DungeonContext.tsx';
import { MonsterCardProps } from '../../src/interfaces/MonsterCardProps.ts';
import { useToast } from '../../src/hooks/useToast.ts';

interface DungeonContextMockProps {
  children: React.ReactNode;
  initialDungeon: string[];
  allMonsters: MonsterCardProps[];
}

const DungeonContextMock = ({ children, initialDungeon, allMonsters }: DungeonContextMockProps) => {
  const [dungeonMonsters, setDungeonMonsters] = useState<MonsterCardProps[]>(
    allMonsters.filter((monster) => initialDungeon.includes(monster.id))
  );

  const { showToast } = useToast();

  const maxFavorites = 6; // Define the maximum dungeon capacity

  const toggleDungeon = (monster: MonsterCardProps) => {
    console.log('Toggling dungeon for monster:', monster);
    const isAlreadyIn = dungeonMonsters.some((m) => m.id === monster.id);

    if (isAlreadyIn) {
      setDungeonMonsters((prev) => prev.filter((m) => m.id !== monster.id));
      showToast({
        message: `${monster.name} removed from dungeon`,
        type: 'info',
        undoAction: () => {
          // Restore monster to dungeon
          setDungeonMonsters((prev) => [...prev, monster]);
          showToast({
            message: `${monster.name} restored to dungeon`,
            type: 'success',
            duration: 3000,
          });
        },
        duration: 5000,
      });
    } else {
      if (dungeonMonsters.length >= maxFavorites) {
        showToast({
          message: 'You can only add 6 monsters to your dungeon',
          type: 'warning',
          duration: 3000,
        });
        return; // Exit early without adding the monster
      }
      // Add monster to dungeon
      setDungeonMonsters((prev) => [...prev, monster]);
      showToast({
        message: `${monster.name} added to dungeon`,
        type: 'success',
        duration: 3000,
      });
    }
  };

  const isInDungeon = (id: string) => dungeonMonsters.some((monster) => monster.id === id);

  return (
    <DungeonContext.Provider value={{ dungeonMonsters, toggleDungeon, isInDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};

export default DungeonContextMock;
