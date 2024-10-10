import { MonsterCardDataProps } from "../../hooks/useMonster";


type Stats = {
  monsters: MonsterCardDataProps[];
};

const DungeonStats = ({ monsters }: Stats) => {
  const totalHp = monsters.reduce((sum, monster) => sum + monster.hp, 0);

  const alignmentCounts = monsters.reduce(
    (counts, monster) => {
      const alignment = monster.alignment || 'unknown';
      counts[alignment] = (counts[alignment] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  return (
    <aside className="flex flex-col items-center text-center">
      <h3 className="text-2xl">Dungeon Stats</h3>
      <p>{`Total hp for monsters: ${totalHp}`}</p>
      <h4>Aligment distribution</h4>
      <ul className="list-disc ml-6">
        {Object.entries(alignmentCounts).map(([alignment, count]) => (
          <li key={alignment}>
            {alignment}: {count}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DungeonStats;
