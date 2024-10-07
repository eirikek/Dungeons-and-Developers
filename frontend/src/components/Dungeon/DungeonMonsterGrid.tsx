import React, { useContext, useState, useEffect } from 'react';
import MonsterCard from '../MonsterCard/MonsterCard.tsx';
import { DungeonContext } from '../../context/DungeonContext.tsx';
import { hourglass } from 'ldrs';

const DungeonMonsterGrid: React.FC = () => {
  const { dungeonMonsters } = useContext(DungeonContext);
  const [loadedMonsters, setLoadedMonsters] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  hourglass.register();

  useEffect(() => {
    setIsLoading(true);
    setLoadedMonsters(0);
  }, [dungeonMonsters]);

  useEffect(() => {
    if (loadedMonsters === dungeonMonsters.length && dungeonMonsters.length > 0) {
      setIsLoading(false);
    }
  }, [loadedMonsters, dungeonMonsters.length]);

  const handleMonsterLoad = () => {
    setLoadedMonsters((prevCount) => prevCount + 1);
  };

  return (
    <section aria-label="Monster List" className="flex flex-col items-center">
      <h2 className="sr-only">Monsters in this dungeon</h2>
      <div
        className="flex flex-col items-center justify-center h-full"
        style={{ display: isLoading ? 'block' : 'none' }}
      >
        <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
      </div>
      <div
        className="bg-customGray bg-opacity-80 p-8 rounded-lg shadow-lg w-2/3 tablet:w-10/12 h-auto flex flex-col items-center justify-center mt-10 mb-10"
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <ul className="grid grid-cols-3 max-laptop:grid-cols-2 max-mobile:grid-cols-1 list-none gap-6">
          {dungeonMonsters.map((monsterName) => (
            <li key={monsterName}>
              <MonsterCard monsterName={monsterName} onLoad={handleMonsterLoad} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DungeonMonsterGrid;
