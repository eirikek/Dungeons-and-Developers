import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NoMonsterImageFound from '../../assets/images/no_monster_image_found.jpg';
import { DungeonContext } from '../../context/DungeonContext.tsx';
import { MonsterCardDataProps } from '../../hooks/useMonster.ts';
import DungeonButton from './DungeonButton.tsx';
import MonsterReviewModal from './MonsterReviewModal.tsx';

export interface MonsterCardProps extends MonsterCardDataProps {
  onLoad: () => void;
  onClickFunc: () => void;
}

const MonsterCard = ({ index, name, type, hp, alignment, size, img, onLoad, onClickFunc }: MonsterCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const location = useLocation();
  const { toggleDungeon, isInDungeon } = useContext(DungeonContext);

  const isOnDungeonPage = location.pathname === '/project2/dungeon';

  useEffect(() => {
    if (index && !img) {
      setImageLoaded(true);
    }
  }, [img, index]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
    onLoad();
  };

  const monsterImageURL = img ? img : NoMonsterImageFound;

  const handleToggleDungeon = () => {
    toggleDungeon({ index, name, type, hp, alignment, size, img });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black max-w-[20vw] rounded-[10px] shadow-[rgba(0,0,0,0.15)_1.95px_1.95px_2.6px]">
      <aside className="flex flex-row gap-8 mb-12">
        {!isOnDungeonPage && (
          <>
            <MonsterReviewModal name={name} monsterIndex={index} image={monsterImageURL} />
            <DungeonButton onAddToDungeonClick={handleToggleDungeon} isInDungeon={isInDungeon(index)} />
          </>
        )}
      </aside>

      {!imageLoaded && <div>Loading image...</div>}
      {imageError ? (
        <img
          src={NoMonsterImageFound}
          alt="No monster image found"
          className="max-w-[15vw] rounded-[15px] shadow-[0_2px_2px_0_rgba(0,0,0,1) top-0 pt-0 mt-0]"
        />
      ) : (
        <img
          src={monsterImageURL}
          alt={img ? 'Image of the monster' : 'No monster image found'}
          className="max-w-[15vw] rounded-[15px] shadow-[0_2px_2px_0_rgba(0,0,0,1) top-0 pt-0 mt-0]"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      )}
      <h2 className="text-white font-bold text-lg">{name}</h2>
      <div className="mb-[3px] p-[5px] text-white font-semibold">
        <p>Type: {type}</p>
        <p>HP: {hp}</p>
        <button onClick={onClickFunc}>Get more info!</button>


      </div>
    </div>
  );
};

export default MonsterCard;
