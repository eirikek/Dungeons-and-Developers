import useMonster from '../../hooks/useMonster.ts';
import NoMonsterImageFound from '../../assets/NoMonsterImageFound.jpg';

interface MonsterPopUpProps {
  monsterName: string;
  closeModal: () => void;
}

const MonsterPopUp: React.FC<MonsterPopUpProps> = ({ monsterName, closeModal }) => {
  const monsterInfo = useMonster(monsterName);
  const monsterImageURL = monsterInfo.img ? `https://www.dnd5eapi.co${monsterInfo.img}` : 'No image Found';

  return (
    <div className="h-[60vh] bg-black w-[40vw]">
      <button className="text-xl text-white " onClick={() => closeModal()}>
        X
      </button>
      <main className={'flex'}>
        <img src={monsterImageURL} alt={'Image of selected monster'} className={'rounded w-[40%]'} />
        <h2>{monsterInfo.name}</h2>
      </main>
    </div>
  );
};

export default MonsterPopUp;
