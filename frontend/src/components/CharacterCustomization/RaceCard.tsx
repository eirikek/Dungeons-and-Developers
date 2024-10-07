
import useRaces from '../../hooks/useRaces.ts';
import dragonborn from '../../assets/dragonborn.png'
import dwarf from '../../assets/dwarf.png'
import elf from '../../assets/elf.png'
import gnome from '../../assets/gnome.png'
import half_elf from '../../assets/half-elf.png'
import half_orc from '../../assets/half-orc.png'
import halfling from '../../assets/halfling.png'
import human from '../../assets/human.png'
import tiefling from '../../assets/tiefling.png'



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
      <section className="flex flex-col justify-center w-3/4 rounded gap-5">
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60 mt-5">
          <img src={dragonborn} alt="dragonborn" className="max-w-60 max-h-80 shadow-none"/>
          <h2 className="text-3xl">{dragonbornName.name}</h2>
          <p className="text-sm">" {dragonbornName.alignment} "</p>
          <input type="checkbox" id ="dragonbornCheckbox" name="dragonborn"/>
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60">
          <img src={dwarf} alt="dwarf" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{dwarfName.name}</h2>
          <p className="text-sm">" {dwarfName.alignment} "</p>
          <input type="checkbox" id="dwarfCheckbox" name="dwarf" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60">
          <img src={elf} alt="elf" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{elfName.name}</h2>
          <p className="text-sm">" {elfName.alignment} "</p>
          <input type="checkbox" id="elfCheckbox" name="elf" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60">
          <img src={gnome} alt="gnome" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{gnomeName.name}</h2>
          <p className="text-sm">" {gnomeName.alignment} "</p>
          <input type="checkbox" id="gnomeCheckbox" name="gnome" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60">
          <img src={half_elf} alt="half elf" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{half_elfName.name}</h2>
          <p className="text-sm">" {half_elfName.alignment} "</p>
          <input type="checkbox" id="halfElfCheckbox" name="halfElf" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60">
          <img src={half_orc} alt="half orc" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{half_orcName.name}</h2>
          <p className="text-sm">" {half_orcName.alignment} "</p>
          <input type="checkbox" id="halfOrcCheckbox" name="halfOrc" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60">
          <img src={halfling} alt="halfling" className="max-w-60 max-h-80 border-none shadow-none" />
          <h2 className="text-3xl">{halflingName.name}</h2>
          <p className="text-sm">" {halflingName.alignment} "</p>
          <input type="checkbox" id="halflingCheckbox" name="halfling" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60">
          <img src={human} alt="human" className="max-w-60 max-h-80 border-none shadow-none" />
          <h2 className="text-3xl">{humanName.name}</h2>
          <p className="text-sm">" {humanName.alignment} "</p>
          <input type="checkbox" id="humanCheckbox" name="human" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-amber-200 bg-opacity-60">
          <img src={tiefling} alt="tiefling" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{tieflingName.name}</h2>
          <p className="text-sm">" {tieflingName.alignment} "</p>
          <input type="checkbox" id="tieflingCheckbox" name="tiefling" />
        </article>

      </section>
    </>
  )
}