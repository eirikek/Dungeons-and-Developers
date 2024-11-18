import { useReactiveVar } from '@apollo/client';
import { useContext } from 'react';
import { selectedRaceIdVar } from 'src/reactivevars/characterReactivevars.ts';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import RaceCard from '../../components/SubPages/RaceCard.tsx';
import { CharacterContext } from '../../context/CharacterContext';

export default function RacePage() {
  const selectedRaceId = useReactiveVar(selectedRaceIdVar);

  const characterContext = useContext(CharacterContext);

  if (!characterContext) {
    throw new Error('CharacterContext must be used within a CharacterProvider');
  }
  const { races, updateRace, loading, error } = characterContext;

  const handleRaceSelect = async (raceId: string) => {
    await updateRace(raceId);
    selectedRaceIdVar(raceId);
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading races.</div>;

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
            selectedRaceId={selectedRaceId}
            onSelect={handleRaceSelect}
          />
        ))}
      </section>
    </SubPageLayout>
  );
}
