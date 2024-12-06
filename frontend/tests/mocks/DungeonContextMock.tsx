import React, { useCallback, useMemo, useState } from 'react';
import { DungeonContext } from '../../src/context/DungeonContext.ts';
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
  const maxFavorites = 6;

  const isInDungeon = useCallback(
    (id: string) => dungeonMonsters.some((monster) => monster.id === id),
    [dungeonMonsters]
  );

  const toggleDungeon = useCallback(
    (monster: MonsterCardProps) => {
      const isAlreadyIn = isInDungeon(monster.id);

      if (isAlreadyIn) {
        setDungeonMonsters((prev) => prev.filter((m) => m.id !== monster.id));
        showToast({
          message: `${monster.name} removed from dungeon`,
          type: 'info',
          duration: 5000,
          undoAction: () => {
            setDungeonMonsters((prev) => [...prev, monster]);
            showToast({
              message: `${monster.name} restored to dungeon`,
              type: 'success',
              duration: 3000,
            });
          },
        });
      } else {
        if (dungeonMonsters.length >= maxFavorites) {
          showToast({
            message: 'You can only add 6 monsters to your dungeon',
            type: 'warning',
            duration: 3000,
          });
          return;
        }
        setDungeonMonsters((prev) => [...prev, monster]);
        showToast({
          message: `${monster.name} added to dungeon`,
          type: 'success',
          duration: 3000,
        });
      }
    },
    [dungeonMonsters, isInDungeon, maxFavorites, showToast]
  );

  const contextValue = useMemo(
    () => ({
      dungeonMonsters,
      toggleDungeon,
      isInDungeon,
    }),
    [dungeonMonsters, toggleDungeon, isInDungeon]
  );

  return <DungeonContext.Provider value={contextValue}>{children}</DungeonContext.Provider>;
};

export default DungeonContextMock;
