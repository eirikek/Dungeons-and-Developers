import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';
import { useToast } from '../../hooks/useToast.ts';
import useCharacterContext from '../../hooks/useCharacter.ts';
import abilityScoreManagement from '../../utils/abilityScoreManagement.ts';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';

export default function AbilityScorePage() {
  const { stateAbilities, loadingStates } = useCharacterContext();
  const { showToast } = useToast();
  const { handleCounterChange, currentArrayScores } = abilityScoreManagement(showToast);
  const { abilityScoresLoading } = loadingStates;

  return (
    <>
      <SubPageLayout>
        {!abilityScoresLoading ? (
          <section className="flex flex-col items-center w-full gap-10">
            {stateAbilities.map((ability, index) => (
              <AbilityScoreCard
                key={`${ability.id}-${index}`}
                id={ability.id}
                name={ability.name}
                index={ability.index}
                skills={ability.skills}
                score={currentArrayScores.get(ability.name) ?? 0}
                onChange={(newValue) => handleCounterChange(ability.name, newValue)}
              />
            ))}
          </section>
        ) : (
          <section className="flex flex-col items-center w-full">
            <LoadingHourglass />
          </section>
        )}
      </SubPageLayout>
    </>
  );
}
