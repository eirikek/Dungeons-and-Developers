import { hourglass } from 'ldrs';
import { useContext, useState, useEffect } from 'react';
import { DungeonContext } from '../../context/DungeonContext.tsx';
import MonsterCard from '../MonsterCard/MonsterCard.tsx';

const DungeonMonsterGrid = () => {
  const { dungeonMonsters } = useContext(DungeonContext);
  const [loadedMonsters, setLoadedMonsters] = useState<number>(0);

  // Register the hourglass if necessary
  useEffect(() => {
    hourglass.register();
  }, []);

  const totalMonsters = dungeonMonsters.length;
  const isLoading = loadedMonsters < totalMonsters;

  const handleMonsterLoad = () => {
    setLoadedMonsters((prevCount) => prevCount + 1);
  };

  return (
    <div className="relative flex-grow w-full overflow-y-auto">
      {/* Hourglass overlay during loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center h-1/2">
          <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
        </div>
      )}

      {dungeonMonsters.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center h-1/2 text-5xl lg:text-4xl xl:text-3xl 2xl:text-2xl">
          <p>No monsters in dungeon</p>
        </div>
      )}

      {/* MonsterCards rendered but hidden until loading completes */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center transition-opacity duration-500 ${
          isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {dungeonMonsters.map((monster, idx) => (
          <MonsterCard key={idx} {...monster} onLoad={handleMonsterLoad} />
        ))}
      </div>
    </div>
  );
};

export default DungeonMonsterGrid;