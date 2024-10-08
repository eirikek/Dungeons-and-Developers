import useAbilityScores from '../../hooks/useAbilityScores.ts';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';

export default function AbilityScorePage() {
  const abilities = ['cha', 'con', 'dex', 'int', 'str', 'wis'];
  const abilityData = abilities.map(useAbilityScores);

  return (
    <SubPageLayout>
      <section className="flex flex-col items-center w-full bg-gradient-to-b from-dragongreen to-black">
        {abilityData.map((ability, index) => (
          <AbilityScoreCard
            key={index}
            name={ability.name}
            description={ability.desc}
            skills={ability.skills.map(skill => ({ name: typeof skill === 'string' ? skill : skill.name }))}
          />
        ))}
      </section>
    </SubPageLayout>
  );
}