import MonsterCard from '../MonsterCard/MonsterCard.tsx';
import mockup from '../../data/mockup.ts';

const monsterNameArray: string[] = mockup.results.map((result: any) => result.index);
const monstersToShow = 6; // Show only 6 monsters

/**
 * Custom Grid component for displaying monsters from api
 * @component
 */
const DungeonMonsterGrid = () => {
  // Slice the first 6 monsters from the monster array
  const displayedMonsters = monsterNameArray.slice(0, monstersToShow);

  return (
    <div
      className="flex-grow gap-10 w-full overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {displayedMonsters.map((monsterName) => (
        <MonsterCard key={monsterName} monsterName={monsterName} onLoad={() => {
        }} />
      ))}
    </div>
  );
};

export default DungeonMonsterGrid;