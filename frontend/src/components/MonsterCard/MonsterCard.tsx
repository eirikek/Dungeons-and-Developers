import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NoMonsterImageFound from '../../assets/NoMonsterImageFound.jpg';
import { DungeonContext } from '../../context/DungeonContext.tsx';
import useMonster, { MonsterCardDataProps } from '../../hooks/useMonster.ts';
import DungeonButton from './DungeonButton.tsx';
import MonsterReviewModal from './MonsterReviewModal.tsx';

export interface MonsterCardProps extends MonsterCardDataProps {
  onLoad: () => void;
}

const MonsterCard = ({ name, type, hp, alignment, size,  img , onLoad }: MonsterCardProps) => {
  //const { isInDungeon, toggleDungeon } = useContext(DungeonContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();

  const isOnDungeonPage = location.pathname === '/project2/dungeon';

  useEffect(() => {
    if (name && !img) {
      setImageLoaded(true);
      onLoad();
    }
  }, [img, onLoad]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad();
  };

  const handleImageError = () => {
    console.log('Image failed to load');
    setImageLoaded(true);
    onLoad();
  };

  if (!name) {
    return <div>Loading...</div>;
  }

  // Function to handle adding a monster to the dungeon
  // Currently commented out due to missing context
  // const handleAddToDungeon = () => {
  //   toggleDungeon({
  //     name: name,
  //     type: type,
  //     alignment: alignment,
  //     hp: hp,
  //     size: size,
  //   });
  // };

  const monsterImageURL = img ? `https://www.dnd5eapi.co${img}` : NoMonsterImageFound;

  return (
    <div className="flex flex-col items-center justify-center bg-black max-w-[20vw] rounded-[10px] shadow-[rgba(0,0,0,0.15)_1.95px_1.95px_2.6px]">
      <aside className="flex flex-row gap-8 mb-12">
        {isOnDungeonPage ? <></> : <MonsterReviewModal name={name} />}

        {/* <DungeonButton onAddToDungeonClick={handleAddToDungeon} isInDungeon={isInDungeon(name)} /> */}
      </aside>

      <img
        src={monsterImageURL}
        alt={img ? 'Image of the monster' : 'No monster image found'}
        className="max-w-[15vw] rounded-[15px] shadow-[0_2px_2px_0_rgba(0,0,0,1) top-0 pt-0 mt-0]"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
      {!imageLoaded && <div>Loading image...</div>}
      <h2 className="text-white font-bold text-lg">{name}</h2>
      <div className="mb-[3px] p-[5px] text-white font-semibold">
        <p>Type: {type}</p>
        <p>HP: {hp}</p>
      </div>
    </div>
  );
};

export default MonsterCard;
