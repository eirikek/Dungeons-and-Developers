import { useContext } from 'react';
import { DungeonContext } from '../../context/DungeonContext';
import MonsterCard from '../MonsterCard/MonsterCard';
import type { MonsterCardProps } from '../../interfaces/MonsterCardProps';

interface MonsterGridProps {
  monsters?: MonsterCardProps[];
  isDungeonPage?: boolean;
}

const MonsterGrid = ({ monsters = [], isDungeonPage = false }: MonsterGridProps) => {
  const { dungeonMonsters } = useContext(DungeonContext);
  console.log({ dungeonMonsters });

  const monstersWithDungeonStatus = isDungeonPage
    ? dungeonMonsters
    : (monsters || []).map((monster) => ({
        ...monster,
        isInDungeon: dungeonMonsters.some((dm) => dm.id === monster.id),
      }));

  return (
    <section
      className={`grid grid-cols-1 md:grid-cols-2 ${
        isDungeonPage ? 'xl:grid-cols-3 gap-x-10 xl:gap-x-28' : 'xl:grid-cols-4 gap-x-[10vw] lg:gap-x-[4vw]'
      } gap-y-5 place-items-center transition-opacity duration-500 p-5`}
    >
      {monstersWithDungeonStatus.length === 0 ? (
        <div className="flex items-center justify-center h-full w-full col-span-full text-center">
          <p className="sub-header">{isDungeonPage ? 'No monsters in dungeon' : 'No monsters found'}</p>
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
