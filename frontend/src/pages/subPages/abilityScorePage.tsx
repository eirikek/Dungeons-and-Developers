import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';

import useCharacterContext from '../../hooks/useCharacter.ts';

import abilityScoreManagement from '../../utils/abilityScoreManagement.ts';

export default function AbilityScorePage() {
  const { stateAbilities } = useCharacterContext();
  const { handleCounterChange, currentArrayScores } = abilityScoreManagement();
  const abilityScoresLoading = currentArrayScores.size === 0;

  return (
    <>
      {!abilityScoresLoading ? (
        <SubPageLayout>
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
        </SubPageLayout>
      ) : (
        <section className="flex flex-col items-center w-full gap-10">
          <h2 className="header mb-[8vh]">Loading ability scores...</h2>
        </section>
      )}
    </>
  );
}
