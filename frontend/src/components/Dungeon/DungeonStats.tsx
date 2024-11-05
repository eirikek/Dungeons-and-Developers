import { useContext } from 'react';
import { DungeonContext } from '../../context/DungeonContext';

const DungeonStats = () => {
  const { dungeonMonsters } = useContext(DungeonContext);
  const totalHp = dungeonMonsters.reduce((sum, monster) => sum + monster.hp, 0);

  return (
    <>
      {dungeonMonsters.length > 0 && (
        <h2 className="mt-5 sub-header" aria-label="Total Dungeon HP">
          Total Dungeon HP: {totalHp}
        </h2>
      )}
    </>
  );
};

export default DungeonStats;
