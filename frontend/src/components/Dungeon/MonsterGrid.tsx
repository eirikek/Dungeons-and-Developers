import { useReactiveVar } from '@apollo/client';
import { useMemo } from 'react';
import type { MonsterCardProps } from '../../interfaces/MonsterCardProps';
import { dungeonMonstersVar } from '../../utils/apolloVars.ts';
import MonsterCard from '../MonsterCard/MonsterCard';

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

  return (
    <section
      className={`grid grid-cols-1 md:grid-cols-2 ${
        isDungeonPage ? 'xl:grid-cols-3 gap-x-10 xl:gap-x-28' : 'xl:grid-cols-4 gap-x-[10vw] lg:gap-x-[4vw]'
      } gap-y-5 place-items-center transition-opacity duration-500 p-5`}
    >
      {monstersWithDungeonStatus.map((monster) => (
        <MonsterCard key={monster.id} {...monster} data-testid="monster-card" />
      ))}
    </section>
  );
};

export default MonsterGrid;
