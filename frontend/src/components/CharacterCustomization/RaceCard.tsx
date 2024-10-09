
import useRaces from '../../hooks/useRaces.ts';
import CharacterRaceCard from './CharacterRaceCard.tsx';



export default function RaceCard() {
  const dragonbornName = useRaces("dragonborn")
  const dwarfName = useRaces("dwarf")
  const elfName = useRaces("elf")
  const gnomeName = useRaces("gnome")
  const half_elfName = useRaces("half-elf")
  const half_orcName = useRaces("half-orc")
  const halflingName = useRaces("halfling")
  const humanName = useRaces("human")
  const tieflingName = useRaces("tiefling")


  return (
    <>
      <CharacterRaceCard
      name={dragonbornName.name}
      index={dragonbornName.index}
      alignment={dragonbornName.alignment}>

      </CharacterRaceCard>
      <CharacterRaceCard
        name={dwarfName.name}
        index={dwarfName.index}
        alignment={dwarfName.alignment}
      />
      <CharacterRaceCard
        name={elfName.name}
        index={elfName.index}
        alignment={elfName.alignment}
      />
      <CharacterRaceCard
        name={gnomeName.name}
        index={gnomeName.index}
        alignment={gnomeName.alignment}
      />
      <CharacterRaceCard
        name={half_elfName.name}
        index={half_elfName.index}
        alignment={half_elfName.alignment}
      />
      <CharacterRaceCard
        name={half_orcName.name}
        index={half_orcName.index}
        alignment={half_orcName.alignment}
      />
      <CharacterRaceCard
        name={halflingName.name}
        index={halflingName.index}
        alignment={halflingName.alignment}
      />
      <CharacterRaceCard
        name={humanName.name}
        index={humanName.index}
        alignment={humanName.alignment}
      />
      <CharacterRaceCard
        name={tieflingName.name}
        index={tieflingName.index}
        alignment={tieflingName.alignment}
      />
    </>
  )
}