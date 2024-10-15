import { useContext, useEffect, useState } from 'react';
import NoMonsterImageFound from '../../assets/images/no_monster_image_found.jpg';
import { DungeonContext } from '../../context/DungeonContext.tsx';
import { MonsterCardDataProps } from '../../hooks/useMonster.ts';
import DungeonButton from './DungeonButton.tsx';
import MonsterReviewModal from './MonsterReviewModal.tsx';

export interface MonsterCardProps extends MonsterCardDataProps {
  onLoad: () => void;
}

const MonsterCard = ({ index, name, type, hp, alignment, size, img, onLoad }: MonsterCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { toggleDungeon, isInDungeon } = useContext(DungeonContext);

  useEffect(() => {
    if (index && !img) {
      setImageLoaded(true);
      onLoad();
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
    <div
      className="flex flex-col items-center justify-between bg-black pb-5 w-[75vw] md:w-[42vw] xl:w-[22vw] 2xl:w-[18vw] h-[40vh] sm:h-[45vh] md:h-[35vh] rounded-lg overflow-hidden"
    >
      <div className="relative w-full h-[30vh] overflow-hidden">
        {!imageLoaded && <div>Loading image...</div>}
        {imageError ? (
          <img
            src={NoMonsterImageFound}
            alt="No monster image found"
            className="max-w-[15vw] rounded-[15px] shadow-[0_2px_2px_0_rgba(0,0,0,1) top-0 pt-0 mt-0]"
          />
        ) : (
          <div className="relative flex justify-center w-full h-full">
            <img
              src={monsterImageURL}
              alt={img ? 'Image of the monster' : 'No monster image found'}
              className="object-cover h-full w-full object-top"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
            <div className="absolute left-[75%] top-5">
              <DungeonButton onAddToDungeonClick={handleToggleDungeon} isInDungeon={isInDungeon(index)} />
            </div>
          </div>
        )}
        {!imageLoaded && <div className="flex justify-center w-full py-24">Loading image...</div>}


      </div>
      <div className="flex flex-col gap-1 w-full p-3">
        <h2 className="text-5xl md:text-3xl lg:text-2xl xl:text-xl 2xl:text-lg bold">{name}</h2>
        <p className="text-4xl md:text-2xl xl:text-lg 2xl:text-sm">Type: {type}</p>
        <p className="text-4xl md:text-2xl xl:text-lg 2xl:text-sm">HP: {hp}</p>
        <div className="flex w-full justify-between">
          <MonsterReviewModal name={name} monsterIndex={index} image={monsterImageURL} />
          <button onClick={handleToggleDungeon}
                  className="text-4xl md:text-2xl xl:text-lg 2xl:text-sm hover:text-customRed transition-all duration-200">{isInDungeon(index) ? 'Remove from dungeon' : 'Add to dungeon'}</button>
        </div>
      </div>
    </div>
  );
};

export default MonsterCard;