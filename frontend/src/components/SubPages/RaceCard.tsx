import { motion } from 'framer-motion';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

import RaceProps from '../../interfaces/RaceProps.ts';

import raceImageMapping from '../../utils/raceImageMapping.ts';

interface RaceCardProps extends RaceProps {
  selectedRaceId: string;
  onSelect: (id: string) => void;
}

const RaceCard = ({ id, index, name, alignment, size, speed, selectedRaceId, onSelect }: RaceCardProps) => {
  const raceImage = raceImageMapping[index];
  const handleSelectRace = () => {
    if (selectedRaceId !== id) {
      onSelect(id);
    }
  };

  return (
    <motion.article
      className="flex flex-col xl:flex-row xl:h-90 w-full justify-between items-center p-8 xl:p-12 rounded-lg bg-black bg-opacity-90 gap-10 card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
      role="article"
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-details`}
    >
      <div className="flex flex-col xl:flex-row gap-5 justify-center items-center ">
        <figure className="max-w-36 xl:max-w-28">
          <img src={raceImage} alt={`${name} race illustration`} className="shadow-none" />
          <figcaption className="sr-only">{name}</figcaption>
        </figure>
        <div role="group">
          <h2 id={`${id}-name`} className="sub-header bold">
            {name}
          </h2>
          <p id={`${id}-details`} className="text">
            {alignment}
          </p>
          <p className="text">
            <span className="bold">Size:</span> {size}
          </p>
          <p className="text">
            <span className="bold">Speed:</span> {speed}
          </p>
        </div>
      </div>
      <div className="w-1/5 flex items-center justify-center xl:justify-end">
        <CustomCheckbox
          scale={2}
          checked={selectedRaceId === id}
          onChange={handleSelectRace}
          disableUncheck={true}
          aria-label={`Select ${name} race`}
        />
      </div>
    </motion.article>
  );
};

export default RaceCard;
