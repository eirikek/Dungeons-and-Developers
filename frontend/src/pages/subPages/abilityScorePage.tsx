import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';

import useCharacterContext from '../../hooks/useCharacter.ts';

import useAbilityScoreManagement from '../../utils/useAbilityScoreManagement.ts';
import abilityScoreMap from '../../utils/abilityScoreMapping.ts';

export default function AbilityScorePage() {
  const { stateAbilities } = useCharacterContext();
  const { handleCounterChange, currentArrayScores } = useAbilityScoreManagement();

  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  //
  // if (error) {
  //   return <div>Error loading abilities.</div>;
  // }

  return (
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
  );
}
