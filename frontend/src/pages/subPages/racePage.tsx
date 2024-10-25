
import RaceCard from '../../components/SubPages/RaceCard.tsx';
import imageMapping from '../../utils/raceImageMapping.ts';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import useRace from '../../hooks/useRaces.ts';



export default function RacePage() {


  const { loading, error, races } = useRace(1, 9);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading races.</div>;


    return (
      <SubPageLayout>
        <section className="flex flex-col items-center w-full gap-10">
          {races.map((race, index) => (
            <RaceCard
              key={index}
              name={race.name}
              description={`${race.alignment}`}
              imageUrl={imageMapping[race.index]}
            />
          ))}
        </section>
      </SubPageLayout>
    );
  }
