
import useAbilityScores from '../../hooks/useAbilityScores.ts';



export default function AbilityScoreCard(){
  const chaName = useAbilityScores("cha")
  const conName = useAbilityScores("con")
  const dexName = useAbilityScores("dex")
  const intName = useAbilityScores("int")
  const strName = useAbilityScores("str")
  const wisName = useAbilityScores("wis")





  return (
    <>
      <section className="flex flex-col justify-center w-3/4 rounded space-y-10">
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg  bg-bluedrake bg-[center_top] bg-[size:100%_600%]">
          <h2 className="text-3xl">{chaName.name}</h2>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <h3 className="text-white">{chaName.full_name}</h3>
          <p className="text-sm">" {chaName.desc} "</p>

          <ul className="text-white">
            Skills:
            {chaName.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </article>

        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg bg-bluedrake bg-[center_16.67%] bg-[size:100%_600%]">
          <h2 className="text-3xl">{conName.name}</h2>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <h3 className="text-white">{conName.full_name}</h3>
          <p className="text-sm">" {conName.desc} "</p>

          <ul className="text-white">
            Skills:
            {conName.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </article>
        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg bg-bluedrake bg-[center_33.33%] bg-[size:100%_600%]">
          <h2 className="text-3xl">{dexName.name}</h2>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <h3 className="text-white">{dexName.full_name}</h3>
          <p className="text-sm">" {dexName.desc} "</p>

          <ul className="text-white">
            Skills:
            {dexName.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </article>

        <article
          className="flex flex-row gap-5 items-center  p-8 rounded-lg shadow-lg bg-bluedrake bg-[center_50%] bg-[size:100%_600%]">
          <h2 className="text-3xl">{intName.name}</h2>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <h3 className="text-white">{intName.full_name}</h3>
          <p className="text-sm">" {intName.desc} "</p>

          <ul className="text-white">
            Skills:
            {intName.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </article>

        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg bg-bluedrake bg-[center_66.67%] bg-[size:100%_600%]">
          <h2 className="text-3xl">{strName.name}</h2>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <h3 className="text-white">{strName.full_name}</h3>
          <p className="text-sm">" {strName.desc} "</p>

          <ul className="text-white">
            Skills:
            {strName.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </article>

        <article
          className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg bg-bluedrake bg-[center_bottom] bg-[size:100%_600%]">
          <h2 className="text-3xl">{wisName.name}</h2>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <h3 className="text-white">{wisName.full_name}</h3>
          <p className="text-sm">" {wisName.desc} "</p>

          <ul className="text-white">
            Skills:
            {wisName.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </article>
      </section>

    </>
  )
}