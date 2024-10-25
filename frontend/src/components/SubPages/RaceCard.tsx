import React from 'react';
import { motion } from 'framer-motion';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';


interface RaceCardProps {
  name: string;
  description: string;
  imageUrl: string;
  alignment: string;
  size: string;
  size_description: string;
  speed: number;
}


const RaceCard: React.FC<RaceCardProps> = ({ name, description, imageUrl, alignment, size, size_description, speed }) => {
  return (
    <motion.section
      className="flex flex-col xl:flex-row xl:h-60 w-full justify-between items-center p-8 xl:p-12 rounded-lg bg-black bg-opacity-80 gap-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div className="flex flex-col xl:flex-row gap-5 justify-center items-center">
        <img src={imageUrl} alt={name} className="max-w-36 xl:max-w-28 shadow-none" />
        <div>
          <h2 className="sub-header bold">{name}</h2>
          <p className="text">{description}</p>
          <p className="text">{alignment}</p>
          <p className="text">{size_description}</p>
          <p className="text">Size: {size}</p>
          <p className="text">Speed: {speed}</p>
        </div>
      </div>
      <div className="w-1/5 flex items-center justify-center xl:justify-end">
        <CustomCheckbox scale={2} />
      </div>
    </motion.section>
  );
};

export default RaceCard;