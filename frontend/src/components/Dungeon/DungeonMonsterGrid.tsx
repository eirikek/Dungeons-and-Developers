import { useContext } from 'react';
import { DungeonContext } from '../../context/DungeonContext';
import MonsterCard from '../MonsterCard/MonsterCard';

const DungeonMonsterGrid = () => {
  const { dungeonMonsters } = useContext(DungeonContext);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 xl:gap-x-28 gap-y-5 place-items-center transition-opacity duration-500 p-5">
      {dungeonMonsters.length === 0 ? (
        <div
          className="absolute inset-0 flex items-center justify-center h-1/2 sub-header">
          <p>No monsters in dungeon</p>
        </div>
      ) : (
        dungeonMonsters.map((monster, idx) => (
          <MonsterCard
            key={idx}
            {...monster}
            hp={monster.hp}
          />
        ))
      )}
    </div>
  );
};

export default DungeonMonsterGrid;