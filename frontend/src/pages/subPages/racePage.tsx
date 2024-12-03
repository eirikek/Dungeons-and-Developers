import RaceCard from '../../components/SubPages/RaceCard.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import { useReactiveVar } from '@apollo/client';

import useCharacterContext from '../../hooks/useCharacter.ts';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import { raceVar } from '../../utils/apolloVars.ts';

export default function RacePage() {
  const currentRace = useReactiveVar(raceVar);

  const { races, updateRace, loadingStates } = useCharacterContext();
  const { raceLoading } = loadingStates;

  const handleRaceSelect = async (raceId: string) => {
    await updateRace(raceId);
    raceVar(raceId);
  };

  return (
    <SubPageLayout>
      {!raceLoading ? (
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
      ) : (
        <section className="flex flex-col items-center min-h-[400vh] w-full">
          <LoadingHourglass />
        </section>
      )}
    </SubPageLayout>
  );
}
