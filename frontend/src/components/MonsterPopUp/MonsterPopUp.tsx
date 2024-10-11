import useMonsters from '../../hooks/useMonsters.ts';
// import NoMonsterImageFound from '../../assets/NoMonsterImageFound.jpg';

interface MonsterPopUpProps {
  monsterName: string;
  closeModal: () => void;
}

const MonsterPopUp: React.FC<MonsterPopUpProps> = ({ monsterName, closeModal }) => {
  const monsterInfo = useMonsters(monsterName);
  const monsterImageURL = monsterInfo.img ? `https://www.dnd5eapi.co${monsterInfo.img}` : ' NoMonsterImageFound';

  return (
    <div className="h-[60vh] bg-black w-[40vw] shadow-inner">
      <button className="text-xl text-white " onClick={() => closeModal()}>
        X
      </button>
      <main className={'flex'}>
        <img
          src={monsterImageURL}
          alt={monsterInfo.img ? 'Image of the monster' : 'No monster image found'}
          className={'rounded w-[40%]'}
        />
        <div className={'flex flex-col'}>
          <h2>{monsterInfo.name}</h2>
          <p>Type: {monsterInfo.type}</p>
          <p>HP: {monsterInfo.hp}</p>
          <p>Alignment: {monsterInfo.alignment}</p>
          <p></p>
        </div>
      </main>
    </div>
  );
};

export default MonsterPopUp;
