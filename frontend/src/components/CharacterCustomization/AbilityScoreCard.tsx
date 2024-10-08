import useAbilityScores from '../../hooks/useAbilityScores.ts';
import CharacterAbilityCard from './CharacterAbilityCard';

export default function AbilityScoreCard() {
  const chaName = useAbilityScores('cha');
  const conName = useAbilityScores('con');
  const dexName = useAbilityScores('dex');
  const intName = useAbilityScores('int');
  const strName = useAbilityScores('str');
  const wisName = useAbilityScores('wis');

  return (
    <main className="flex flex-col justify-center w-3/4 rounded gap-5">
      {/* Render a CharacterAbilityCard for each ability */}
      <CharacterAbilityCard
        name={chaName.name}
        fullName={chaName.full_name}
        description={chaName.desc}
        skills={chaName.skills.map(skill => ({ name: typeof skill === 'string' ? skill : skill.name }))}
      />
      <CharacterAbilityCard
        name={conName.name}
        fullName={conName.full_name}
        description={conName.desc}
        skills={conName.skills.map(skill => ({ name: typeof skill === 'string' ? skill : skill.name }))}
      />
      <CharacterAbilityCard
        name={dexName.name}
        fullName={dexName.full_name}
        description={dexName.desc}
        skills={dexName.skills.map(skill => ({ name: typeof skill === 'string' ? skill : skill.name }))}
      />
      <CharacterAbilityCard
        name={intName.name}
        fullName={intName.full_name}
        description={intName.desc}
        skills={intName.skills.map(skill => ({ name: typeof skill === 'string' ? skill : skill.name }))}
      />
      <CharacterAbilityCard
        name={strName.name}
        fullName={strName.full_name}
        description={strName.desc}
        skills={strName.skills.map(skill => ({ name: typeof skill === 'string' ? skill : skill.name }))}
      />
      <CharacterAbilityCard
        name={wisName.name}
        fullName={wisName.full_name}
        description={wisName.desc}
        skills={wisName.skills.map(skill => ({ name: typeof skill === 'string' ? skill : skill.name }))}
      />
    </main>
  );
}



