import React, { useState, useEffect, useContext } from 'react';
import useMonster from '../../hooks/useMonster.ts';
import NoMonsterImageFound from '../../assets/NoMonsterImageFound.jpg';
import DungeonButton from './DungeonButton.tsx';
import { DungeonContext } from '../../context/DungeonContext.tsx';
import MonsterReviewModal from './MonsterReviewModal.tsx';

export interface MonsterCardProps {
  monsterName: string;
  onLoad: () => void;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monsterName, onLoad }) => {
  const { isInDungeon, toggleDungeon } = useContext(DungeonContext);
  const monsterInfo = useMonster(monsterName);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (monsterInfo.name && !monsterInfo.img) {
      setImageLoaded(true);
      onLoad();
    }
  }, [monsterInfo.img, onLoad]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad();
  };

  const handleImageError = () => {
    console.log('Image failed to load');
    setImageLoaded(true);
    onLoad();
  };

  if (!monsterInfo.name) {
    return <div>Loading...</div>;
  }

  const monsterImageURL = monsterInfo.img ? `https://www.dnd5eapi.co${monsterInfo.img}` : NoMonsterImageFound;

  return (
    <div className="flex flex-col items-center justify-center bg-black max-w-[20vw] rounded-[10px] shadow-[rgba(0,0,0,0.15)_1.95px_1.95px_2.6px]">
      <aside className="flex flex-row gap-8 mb-12">
        {isInDungeon(monsterName) ? <></> : <MonsterReviewModal name={monsterName} />}

        <DungeonButton onAddToDungeonClick={() => toggleDungeon(monsterName)} isInDungeon={isInDungeon(monsterName)} />
      </aside>

      <img
        src={monsterImageURL}
        alt={monsterInfo.img ? 'Image of the monster' : 'No monster image found'}
        className="max-w-[15vw] rounded-[15px] shadow-[0_2px_2px_0_rgba(0,0,0,1) top-0 pt-0 mt-0]"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
      {!imageLoaded && <div>Loading image...</div>}
      <h2 className="text-white font-bold text-lg">{monsterInfo.name}</h2>
      <div className="mb-[3px] p-[5px] text-white font-semibold">
        <p>Type: {monsterInfo.type}</p>
        <p>HP: {monsterInfo.hp}</p>
      </div>
    </div>
  );
};

export default MonsterCard;
