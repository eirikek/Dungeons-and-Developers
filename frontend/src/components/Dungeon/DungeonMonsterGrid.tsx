import mockup from '../../data/mockup.ts';
import { useState } from 'react';
import MonsterCard, { MonsterCardProps } from '../MonsterCard/MonsterCard.tsx';

/**
 * Custom Grid component for displaying monsters from api
 * @component
 */

const DungeonMonsterGrid = () => {
  const [dungeonMonsters, setDungeonMonsters] = useState<string[]>([]);
  const [loadedMonsters, setLoadedMonsters] = useState(0);

  const handleMonsterLoad = () => {
    setLoadedMonsters((prev) => prev + 1);
  };

  const toggleMonstersInDungeon = (monsterName: string) => {
    setDungeonMonsters((prev) =>
      prev.includes(monsterName) ? prev.filter((name) => name !== monsterName) : [...prev, monsterName]
    );
  };

  const dungeonMonstersOnly = mockup.results.filter((monster) => dungeonMonsters.includes(monster.name));
  return (
    <>
      <section aria-label="Monster List">
        <h2 className="sr-only">Monsters in this dungeon</h2> {/* Accessibility heading*/}
        <ul className="grid grid-cols-3 max-laptop:grid-cols-2 max-mobile:grid-cols-1 list-none gap-6">
          {dungeonMonstersOnly.map((monster) => (
            <li key={monster.name}>
              <MonsterCard
                monsterName={monster.name}
                onLoad={handleMonsterLoad}
                isInDungeon={dungeonMonsters.includes(monster.name)}
                onToggleDungeon={toggleMonstersInDungeon}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default DungeonMonsterGrid;
