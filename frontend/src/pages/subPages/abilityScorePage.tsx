import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';
import { useToast } from '../../hooks/useToast.ts';
import useCharacterContext from '../../hooks/useCharacter.ts';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import useAbilityScoreManagement from '../../hooks/useAbilityScoreManagement.ts';
import { useEffect } from 'react';

export default function AbilityScorePage() {
  const { stateAbilities, loadingStates } = useCharacterContext();
  const { showToast } = useToast();
  const { handleCounterChange, currentArrayScores } = useAbilityScoreManagement(showToast);
  const { abilityScoresLoading } = loadingStates;

  useEffect(() => {
    console.log(currentArrayScores.values());
  }, [currentArrayScores]);

  return (
    <>
      <SubPageLayout>
        {!abilityScoresLoading && currentArrayScores.size !== 0 ? (
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
          <section className="flex flex-col items-center w-full min-h-[265vh]">
            <LoadingHourglass />
          </section>
        )}
      </SubPageLayout>
    </>
  );
}
