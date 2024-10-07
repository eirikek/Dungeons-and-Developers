
import useRaces from '../../hooks/useRaces.ts';



export default function RaceCard() {
  const dragonbornName = useRaces("dragonborn")






  return (
    <>
      <section className="flex flex-col justify-center w-3/4 rounded space-y-10">
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg ">
          <h2 className="text-3xl">{dragonbornName.name}</h2>
          <p className="text-sm">" {dragonbornName.alignment} "</p>


        </article>
      </section>
    </>
  )
}