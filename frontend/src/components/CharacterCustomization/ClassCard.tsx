
import useClasses from '../../hooks/useClasses.ts';
import barbarian from '../../assets/c3barbarianintro.png'
import cleric from '../../assets/c3clericintro.png'
import druid from '../../assets/c3druidintro.png'
import fighter from '../../assets/c3fighterintro.png'
import monk from '../../assets/c3monkintro.png'
import paladin from '../../assets/c3paladinintro.png'
import ranger from '../../assets/c3rangerintro.png'
import rogue from '../../assets/c3rogueintro.png'
import sorcerer from '../../assets/c3sorcererintro.png'
import warlock from '../../assets/c3warlockintro.png'
import wizard from '../../assets/c3wizardintro.png'
import bard from '../../assets/c3bardintro.png'




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
      <section className="flex flex-col justify-center w-3/4 rounded gap-5 ">
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60 mt-5">
          <img src ={barbarian} alt="barbarian" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{barbarianName.name}</h2>
          <p className="text-sm">Hit-die: {barbarianName.hit_die} </p>
          <input type="checkbox" id="barbarianCheckbox" name="barbarian" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={bard} alt="bard" className="max-w-60 max-h-80 border-none shadow-none" />
          <h2 className="text-3xl">{bardName.name}</h2>
          <p className="text-sm">Hit-die: {bardName.hit_die} </p>
          <input type="checkbox" id="bardCheckbox" name="bard" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={cleric} alt="cleric" className="max-w-60 max-h-80 border-none shadow-none" />
          <h2 className="text-3xl">{clericName.name}</h2>
          <p className="text-sm">" {clericName.hit_die} "</p>
          <input type="checkbox" id="clericCheckbox" name="clericName" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={druid} alt="druid" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{druidName.name}</h2>
          <p className="text-sm">Hit-die: {druidName.hit_die} </p>
          <input type="checkbox" id="druidCheckbox" name="druidName" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={fighter} alt="fighter" className="max-w-60 max-h-80 border-none shadow-none" />
          <h2 className="text-3xl">{fighterName.name}</h2>
          <p className="text-sm">Hit-die: {fighterName.hit_die} </p>
          <input type="checkbox" id="fighterCheckbox" name="fighter" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={monk} alt="monk" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{monkName.name}</h2>
          <p className="text-sm">Hit-die: {monkName.hit_die} </p>
          <input type="checkbox" id="monkNameCheckbox" name="monkName" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={paladin} alt="bard" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{paladinName.name}</h2>
          <p className="text-sm">Hit-die: {paladinName.hit_die} </p>
          <input type="checkbox" id="paladinCheckbox" name="paladin" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={ranger} alt="ranger" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{rangerName.name}</h2>
          <p className="text-sm">Hit-die: {rangerName.hit_die} </p>
          <input type="checkbox" id="rangerCheckbox" name="ranger" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={rogue} alt="rogue" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{rogueName.name}</h2>
          <p className="text-sm">Hit-die: {rogueName.hit_die} </p>
          <input type="checkbox" id="rogueCheckbox" name="rogue" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={sorcerer} alt="sorcerer" className="max-w-60 max-h-80 border-none shadow-none"/>
          <h2 className="text-3xl">{sorcererName.name}</h2>
          <p className="text-sm">Hit-die: {sorcererName.hit_die} </p>
          <input type="checkbox" id="sorcererCheckbox" name="sorcerer" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={warlock} alt="warlock" className="max-w-60 max-h-80 border-none shadow-none" />
          <h2 className="text-3xl">{warlockName.name}</h2>
          <p className="text-sm">Hit-die: {warlockName.hit_die} </p>
          <input type="checkbox" id="warlockCheckbox" name="warlock" />
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg bg-blue-200 bg-opacity-60">
          <img src={wizard} alt="wizard" className="max-w-60 border-none shadow-none"/>
          <h2 className="text-3xl">{wizardName.name}</h2>
          <p className="text-sm">Hit-die: {wizardName.hit_die} </p>
          <input type="checkbox" id="wizardCheckbox" name="wizard" />
        </article>

      </section>
    </>
  )
}