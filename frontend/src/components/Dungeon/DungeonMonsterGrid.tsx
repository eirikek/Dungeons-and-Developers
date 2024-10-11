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
    <div
      className="flex-grow gap-10 w-full overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      <div
        className="flex flex-col items-center justify-center w-full h-full"
        style={{ display: isLoading ? 'block' : 'none' }}
      >
        <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
      </div>
      {dungeonMonsters.map((monster, idx) => (
        <MonsterCard key={idx} {...monster} onLoad={handleMonsterLoad} />
      ))}
    </div>
  );
};

export default DungeonMonsterGrid;
