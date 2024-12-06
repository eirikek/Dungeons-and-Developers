import { useDungeonContext } from '../../context/DungeonContext';

/**
 * DungeonStats is a component that calculates the total hit-points of the dungeon.
 *
 * It uses the `DungeonContext` to calculate the sum of their `hit_points`.
 * This is shown in your dungeon.
 *
 **/
const DungeonStats = () => {
  const { dungeonMonsters } = useDungeonContext();
  const totalHp = dungeonMonsters.reduce((sum, monster) => sum + monster.hit_points, 0);

  return (
    <>
      {dungeonMonsters.length > 0 && (
        <h3 className="sub-header" aria-label="Total Dungeon HP">
          Total Dungeon HP: {totalHp}
        </h3>
      )}
    </>
  );
};

export default DungeonStats;
