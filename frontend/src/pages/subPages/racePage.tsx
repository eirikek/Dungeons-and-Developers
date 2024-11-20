import RaceCard from '../../components/SubPages/RaceCard.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import { makeVar, useReactiveVar } from '@apollo/client';

import useCharacterContext from '../../hooks/useCharacter.ts';
export const raceVar = makeVar<string>('');

export default function RacePage() {
  const currentRace = useReactiveVar(raceVar);

  const { races, updateRace } = useCharacterContext();

  const handleRaceSelect = async (raceId: string) => {
    await updateRace(raceId);
    raceVar(raceId);
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading races.</div>;

  return (
    <SubPageLayout>
      <section className="flex flex-col items-center w-full gap-10">
        {races.map((race) => (
          <RaceCard
            key={race.index}
            index={race.index}
            id={race.id}
            name={race.name}
            alignment={race.alignment}
            size={race.size}
            speed={race.speed}
            selectedRaceId={currentRace}
            onSelect={handleRaceSelect}
          />
        ))}
      </section>
    </SubPageLayout>
  );
}
