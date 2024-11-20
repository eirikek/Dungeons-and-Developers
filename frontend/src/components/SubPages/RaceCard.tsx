import React from 'react';
import { motion } from 'framer-motion';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

import RaceProps from '../../interfaces/RaceProps.ts';

import raceImageMapping from '../../utils/raceImageMapping.ts';
import { UPDATE_USER_RACE } from '../../graphql/updateUserQueries.ts';

interface RaceCardProps extends RaceProps {
  selectedRaceId: string;
  onSelect: (id: string) => void;
}

const RaceCard: React.FC<RaceCardProps> = ({ id, index, name, alignment, size, speed, selectedRaceId, onSelect }) => {
  const raceImage = raceImageMapping[index];
  const handleSelectRace = () => {
    if (selectedRaceId !== id) {
      onSelect(id);
    }
  };

  return (
    <motion.section
      className="flex flex-col xl:flex-row xl:h-90 w-full justify-between items-center p-8 xl:p-12 rounded-lg bg-black bg-opacity-90 gap-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div className="flex flex-col xl:flex-row gap-5 justify-center items-center ">
        <img src={raceImage} alt={name} className="max-w-36 xl:max-w-28 shadow-none" />
        <div>
          <h2 className="sub-header bold">{name}</h2>
          <p className="text">{alignment}</p>
          <p className="text">Size: {size}</p>
          <p className="text">Speed: {speed}</p>
        </div>
      </div>
      <div className="w-1/5 flex items-center justify-center xl:justify-end">
        <CustomCheckbox scale={2} checked={selectedRaceId === id} onChange={handleSelectRace} disableUncheck={true} />
      </div>
    </motion.section>
  );
};

export default RaceCard;
