import { useReactiveVar } from '@apollo/client';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import RaceCard from '../../components/SubPages/RaceCard.tsx';

import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import useCharacterContext from '../../hooks/useCharacter.ts';
import { raceVar } from '../../utils/apolloVars.ts';

/**
 * RacePage Component
 *
 * A character race selection page that displays available D&D races.
 *
 * Features:
 * - Interactive race selection cards
 * - Persistent race selection using Apollo reactive variables
 * - Loading state management
 * - Integration with character context
 *
 * State Management:
 * - raceVar: Apollo reactive variable for selected race
 * - Uses CharacterContext for race data and updates
 *
 * Component Structure:
 * - Wrapped in SubPageLayout
 * - Renders RaceCard components for each available race
 * - Conditional loading state with LoadingHourglass
 *
 * Props (RaceCard):
 * - index: Reference index for race
 * - id: Unique race identifier
 * - name: Race name
 * - alignment: Race alignment description
 * - size: Race size category
 * - speed: Race movement speed
 * - selectedRaceId: Currently selected race
 * - onSelect: Race selection handler
 *
 * Loading States:
 * - Shows LoadingHourglass during race data fetch
 * - Conditional rendering based on raceLoading flag
 *
 * @returns  Rendered RacePage component
 */
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
