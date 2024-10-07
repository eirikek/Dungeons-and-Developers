import mockup from '../../data/mockup.ts';
import { useContext, useState } from 'react';
import MonsterCard, { MonsterCardProps } from '../MonsterCard/MonsterCard.tsx';
import { DungeonContext } from '../../context/DungeonContext.tsx';

/**
 * Custom Grid component for displaying monsters from api
 * @component
 */

const DungeonMonsterGrid = () => {
  const [loadedMonsters, setLoadedMonsters] = useState(0);

  const { dungeonMonsters } = useContext(DungeonContext);

  const handleMonsterLoad = () => {
    setLoadedMonsters((prev) => prev + 1);
  };

  return (
    <>
      <section aria-label="Monster List">
        <h2 className="sr-only">Monsters in this dungeon</h2> {/* Accessibility heading*/}
        <ul className="grid grid-cols-3 max-laptop:grid-cols-2 max-mobile:grid-cols-1 list-none gap-6">
          {dungeonMonsters.map((monsterName) => (
            <li key={monsterName}>
              <MonsterCard monsterName={monsterName} onLoad={() => handleMonsterLoad} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default DungeonMonsterGrid;
