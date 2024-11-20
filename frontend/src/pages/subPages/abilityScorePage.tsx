import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';

import useCharacterContext from '../../hooks/useCharacter.ts';

import abilityScoreMap from '../../utils/abilityScoreMapping.ts';
import useAbilityScoreManagement from '../../utils/useAbilityScoreManagement.ts';

export default function AbilityScorePage() {
  const { stateAbilities } = useCharacterContext();
  const { handleCounterChange, currentArrayScores } = useAbilityScoreManagement();
  const abilityScoresLoading = currentArrayScores.size === 0;

  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  //
  // if (error) {
  //   return <div>Error loading abilities.</div>;
  // }

  return (
    <>
      {!abilityScoresLoading ? (
        <SubPageLayout>
          <section className="flex flex-col items-center w-full gap-10">
            {stateAbilities.map((ability, index) => (
              <AbilityScoreCard
                key={ability.index}
                id={ability.id}
                name={ability.name}
                index={ability.index}
                skills={ability.skills}
                score={currentArrayScores.get(ability.name) ?? 0}
                onChange={(newValue) => handleCounterChange(index, newValue, abilityScoreMap)}
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
