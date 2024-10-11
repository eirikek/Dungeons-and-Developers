import useMonsters from '../../hooks/useMonsters.ts';
// import NoMonsterImageFound from '../../assets/NoMonsterImageFound.jpg';

interface MonsterPopUpProps {
  monsterName: string;
  closeModal: () => void;
}

const MonsterModal: React.FC<MonsterPopUpProps> = ({ monsterName, closeModal }) => {
  const monsterInfo = useMonsters(monsterName);
  const monsterImageURL = monsterInfo.img ? `https://www.dnd5eapi.co${monsterInfo.img}` : ' NoMonsterImageFound';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="relative bg-black rounded-lg shadow-lg w-[40vw] h-fit p-6">
        <button
          className="absolute top-2 right-2 text-xl text-white bg-red-600 m-1 w-8 h-8 flex items-center justify-center"
          onClick={closeModal}
        >
          &times;
        </button>
        <main className="flex flex-col items-center">
          <img
            src={monsterImageURL}
            alt={monsterInfo.img ? 'Image of the monster' : 'No monster image found'}
            className="rounded w-[70%] h-auto mb-4"
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{monsterInfo.name}</h2>
            <p className="text-lg mb-1">
              <span className="font-bold">Type:</span> {monsterInfo.type}
            </p>
            <p className="text-lg mb-1">
              <span className="font-bold">HP:</span> {monsterInfo.hp}
            </p>
            <p className="text-lg mb-1">
              <span className="font-bold">Alignment:</span> {monsterInfo.alignment}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MonsterModal;
