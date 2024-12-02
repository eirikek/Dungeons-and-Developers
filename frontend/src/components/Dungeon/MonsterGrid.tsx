import React, { useMemo } from 'react';
import { dungeonMonstersVar } from '../../context/DungeonContext';
import MonsterCard from '../MonsterCard/MonsterCard';
import type { MonsterCardProps } from '../../interfaces/MonsterCardProps';
import { useReactiveVar } from '@apollo/client';

interface MonsterGridProps {
  monsters?: MonsterCardProps[];
  isDungeonPage?: boolean;
}

const MonsterGrid = ({ monsters = [], isDungeonPage = false }: MonsterGridProps) => {
  const dungeonMonsters = useReactiveVar(dungeonMonstersVar);

  const monstersWithDungeonStatus = useMemo(() => {
    return isDungeonPage
      ? dungeonMonsters
      : monsters.map((monster) => ({
          ...monster,
          isInDungeon: dungeonMonsters.some((dm) => dm.id === monster.id),
        }));
  }, [monsters, dungeonMonsters, isDungeonPage]);

  const loading = monstersWithDungeonStatus.length < 1;

  return (
    <section
      className={`grid grid-cols-1 md:grid-cols-2 ${
        isDungeonPage ? 'xl:grid-cols-3 gap-x-10 xl:gap-x-28' : 'xl:grid-cols-4 gap-x-[10vw] lg:gap-x-[4vw]'
      } gap-y-5 place-items-center transition-opacity duration-500 p-5`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[79.5vh]" data-testid="loading-indicator">
          <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
        </div>
      ) : (
        monstersWithDungeonStatus.map((monster) => (
          <MonsterCard key={monster.id} {...monster} data-testid="monster-card" />
        ))
      )}
    </section>
  );
};

export default MonsterGrid;
