import { useReactiveVar } from '@apollo/client';
import { useMemo } from 'react';
import { dungeonMonstersVar } from '../../utils/apolloVars.ts';
import MonsterCard from '../MonsterCard/MonsterCard';
import MonsterGridProps from '../../interfaces/MonsterGridProps.ts';

/**
 * Renders a MonsterGrid component marking whether
 * they are in the dungeon based on the context.
 *
 * It uses `useReactiveVar` from Apollo Client.
 *
 * @param {Array} monsters - The list of monsters to display.
 * @param {boolean} isDungeonPage - Boolean value to indicate if it is on the dungeon page or not.
 *
 */

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
    <article
      role="grid"
      className={`grid grid-cols-1 md:grid-cols-2 ${
        isDungeonPage ? 'xl:grid-cols-3 gap-x-10 xl:gap-x-28' : 'xl:grid-cols-4 gap-x-[10vw] lg:gap-x-32'
      } gap-y-5 place-items-center transition-opacity duration-500 p-5`}
    >
      {monstersWithDungeonStatus.map((monster) => (
        <MonsterCard key={monster.id} {...monster} data-testid="monster-card" />
      ))}
    </article>
  );
};

export default MonsterGrid;
