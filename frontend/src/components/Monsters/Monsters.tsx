// import MonsterCard from '../MonsterCard/MonsterCard.tsx';

type Monster = {
  name: string;
  // size: string;
  // type: string;
  // alignment: string;
  // hit_points: number;
};
interface MonstersProps {
  monsters: Monster[];
}

export default function Monsters({ monsters }: MonstersProps) {
  return (
    <>
      <section className="grid grid-cols-5 ">
        {monsters.map((monster) => (
          <div>
            <p>{monster.name}</p>
          </div>
        ))}
      </section>
    </>
  );
}
