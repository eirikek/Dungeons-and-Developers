import { useContext } from 'react';
import { DungeonContext } from '../../context/DungeonContext';
import MonsterCard from '../MonsterCard/MonsterCard';

const DungeonMonsterGrid = () => {
  const { dungeonMonsters } = useContext(DungeonContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-5 place-items-center">
      {dungeonMonsters.length === 0 ? (
        <p>No monsters in dungeon</p>
      ) : (
        dungeonMonsters.map((monster, idx) => (
          <MonsterCard
            key={idx}
            {...monster}
            hp={monster.hit_points} // Map hit_points to hp
          />
        ))
      )}
    </div>
  );
};

export default DungeonMonsterGrid;