import React, { useState, useEffect } from 'react';
import useMonsters from '../../hooks/useMonsters.ts';
import NoMonsterImageFound from '../../assets/images/no_monster_image_found.jpg';
import MonsterCardInfo from './MonsterReviewModal.tsx';
import unfavoriteIcon from '../../assets/images/unfavorite.png';
import favoriteIcon from '../../assets/images/favorite.png';

interface MonsterCardProps {
  monsterName: string;
  onLoad: () => void;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monsterName, onLoad }) => {
  const monsterInfo = useMonsters(monsterName);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (monsterInfo.name && !monsterInfo.img) {
      setImageLoaded(true);
      onLoad();
    }
  }, [monsterInfo.img, onLoad]);

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev); // Toggle favorite state
  };

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
    <div
      className="flex flex-col items-center justify-between bg-black shadow-black shadow-2xl pb-5 w-72 h-[340px] rounded-lg overflow-hidden"
    >
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={monsterImageURL}
          alt={monsterInfo.img ? 'Image of the monster' : 'No monster image found'}
          className="object-cover h-full w-full object-top"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        {!imageLoaded && <div className="flex justify-center w-full py-24">Loading image...</div>}

        <button
          className="absolute top-0 right-2"
          onClick={handleToggleFavorite}
        >
          <img
            src={
              isFavorite
                ? favoriteIcon
                : unfavoriteIcon
            }
            alt="favorite-icon"
            className="w-20 h-20"
            style={{
              objectFit: 'contain',
            }}
          />
        </button>

      </div>
      <div className="flex flex-col gap-1 w-full p-3">
        <h2 className="text-white text-xl bold">{monsterInfo.name}</h2>
        <p className="text-md">Type: {monsterInfo.type}</p>
        <p className="text-md">HP: {monsterInfo.hp}</p>
      </div>
      <MonsterCardInfo name={monsterName} />
    </div>
  );
};

export default MonsterCard;
