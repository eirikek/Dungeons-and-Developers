import Monsters from '../../data/mockup.ts';
import { useState } from 'react';

/**
 * Custom Grid component for displaying monsters from api
 * @component
 */

const DungeonMonsterGrid = () => {
  const [monsters, setMonsters] = useState(Monsters.results.slice(0, 6));
  return (
    <>
      <section aria-label="Monster List">
        <h2 className="sr-only">Monsters in this dungeon</h2> {/* Accessibility heading*/}
        <ul className="grid grid-cols-3 max-laptop:grid-cols-2 max-mobile:grid-cols-1 list-none gap-6">
          {monsters.map((monster, index) => (
            <li
              key={index}
              className="bg-customRed p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-white text-lg max-mobile:text-sm">{monster.name}</h3>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default DungeonMonsterGrid;
