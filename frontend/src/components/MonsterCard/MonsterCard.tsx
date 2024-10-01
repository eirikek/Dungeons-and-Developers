import useMonster from '../../hooks/useMonster.ts';
import "./MonsterCard.css"

interface MonsterCardProps {
  monsterName: string;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monsterName }) => {

  const monsterInfo = useMonster(monsterName)
  const monsterImageURL = "https://www.dnd5eapi.co" + monsterInfo.img;

  return(
    <div className="card">
      <h2>{monsterInfo.name}</h2>
      <img src={monsterImageURL} />
      <p>Type: {monsterInfo.type}</p>
      <p> Size: {monsterInfo.size}</p>
      <p>Alignment: {monsterInfo.alignment}</p>
      <p>HP: {monsterInfo.hp}</p>
      <p className="stats">Click for more stats!</p>
    </div>
  )
}

export default MonsterCard;