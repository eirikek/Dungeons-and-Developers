import { hourglass } from 'ldrs';
import { useContext, useState } from 'react';
import { DungeonContext } from '../../context/DungeonContext.tsx';
import MonsterCard from '../MonsterCard/MonsterCard.tsx';

const DungeonMonsterGrid = () => {
  const { dungeonMonsters } = useContext(DungeonContext);
  const [loadedMonsters, setLoadedMonsters] = useState<number>(0);

  hourglass.register();
  const isLoading = loadedMonsters < dungeonMonsters.length;

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
        <ul className="flex-grow gap-10 w-full grid grid-cols-3 max-laptop:grid-cols-2 max-mobile:grid-cols-1 list-none gap-6">
          {dungeonMonsters.map((monster) => (
            <li key={monster.index}>
              <MonsterCard {...monster} onLoad={handleMonsterLoad} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DungeonMonsterGrid;
