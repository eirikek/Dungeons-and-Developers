
import useClasses from '../../hooks/useClasses.ts';
import CharacterClassCard from './CharacterClassCrad.tsx';

export default function ClassCard() {
  const barbarianName = useClasses("barbarian")
  const bardName = useClasses("bard")
  const clericName = useClasses("cleric")
  const druidName = useClasses("druid")
  const fighterName = useClasses("fighter")
  const monkName = useClasses("monk")
  const paladinName = useClasses("paladin")
  const rangerName = useClasses("ranger")
  const rogueName = useClasses("rogue")
  const sorcererName = useClasses("sorcerer")
  const warlockName = useClasses("warlock")
  const wizardName = useClasses("wizard")
  console.log("a")






  return (
    <>
      <main className="flex flex-col justify-center w-3/4 rounded gap-5">
        <CharacterClassCard
        name={barbarianName.name}
        index={barbarianName.index}
        hit_die={barbarianName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={bardName.name}
          index={bardName.index}
          hit_die={bardName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={clericName.name}
          index={clericName.index}
          hit_die={clericName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={druidName.name}
          index={druidName.index}
          hit_die={druidName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={fighterName.name}
          index={fighterName.index}
          hit_die={fighterName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={monkName.name}
          index={monkName.index}
          hit_die={monkName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={paladinName.name}
          index={paladinName.index}
          hit_die={paladinName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={rangerName.name}
          index={rangerName.index}
          hit_die={rangerName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={rogueName.name}
          index={rogueName.index}
          hit_die={rogueName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={sorcererName.name}
          index={sorcererName.index}
          hit_die={sorcererName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={warlockName.name}
          index={warlockName.index}
          hit_die={warlockName.hit_die}
        ></CharacterClassCard>
        <CharacterClassCard
          name={wizardName.name}
          index={wizardName.index}
          hit_die={wizardName.hit_die}
        ></CharacterClassCard>
      </main>
      </>
      )
      }