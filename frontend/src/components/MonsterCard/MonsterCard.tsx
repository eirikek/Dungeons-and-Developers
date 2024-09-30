import useMonster from '../../hooks/useMonster.ts';
import "./MonsterCard.css"

export default function MonsterCard() {

  const monsterInfo = useMonster("adult-black-dragon")
  const monsterImageURL = "https://www.dnd5eapi.co" + monsterInfo.img;

  return(
    <div className="card">
      <h2>{monsterInfo.name}</h2>
      <img src={monsterImageURL} />
      <p>{monsterInfo.type}</p>
      <p>{monsterInfo.alignment}</p>
      <p>HP: {monsterInfo.hp}</p>
    </div>
  )
}