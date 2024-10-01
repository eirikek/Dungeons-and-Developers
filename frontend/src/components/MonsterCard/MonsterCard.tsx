import useMonster from '../../hooks/useMonster.ts';
import NoMonsterImageFound from '../../assets/NoMonsterImageFound.jpg';

interface MonsterCardProps {
  monsterName: string;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monsterName }) => {
  const monsterInfo = useMonster(monsterName);
  const monsterImageURL = 'https://www.dnd5eapi.co' + monsterInfo.img;

  return (
    <div className="flex flex-col items-center justify-center bg-[#BA3B46] max-w-[20vw] rounded-[10px] shadow-[rgba(0,0,0,0.15)_1.95px_1.95px_2.6px]">
      <h2 className="text-white font-bold text-lg">{monsterInfo.name}</h2>
      {monsterInfo.img ? (
        <img
          src={monsterImageURL}
          alt={'Image of the monster on the card'}
          className="max-w-[15vw] rounded-[15px] shadow-[0_2px_2px_0_rgba(0,0,0,1)]"
        />
      ) : (
        <img
          src={NoMonsterImageFound}
          alt={'Stock image if no image of monster is found'}
          className="max-w-[15vw] rounded-[15px] shadow-[0_2px_2px_0_rgba(0,0,0,1)]"
        />
      )}
      <div className="mb-[3px] p-[5px] text-white font-semibold">
        <p>Type: {monsterInfo.type}</p>
        <p> Size: {monsterInfo.size}</p>
        <p>Alignment: {monsterInfo.alignment}</p>
        <p>HP: {monsterInfo.hp}</p>
        <p>Click for more stats!</p>
      </div>
    </div>
  );
};

export default MonsterCard;
