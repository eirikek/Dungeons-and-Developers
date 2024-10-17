import React from 'react';
import { motion } from 'framer-motion';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

interface RaceCardProps {
  name: string;
  description: string;
  imageUrl: string;
}

const RaceCard: React.FC<RaceCardProps> = ({ name, description, imageUrl }) => {
  return (
    <motion.section
      className="flex flex-row h-60 w-full justify-between items-center p-12 rounded-lg bg-black bg-opacity-80 gap-x-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div>
        <img src={imageUrl} alt={name} className="max-w-28 shadow-none" />
      </div>
      <div>
        <h2 className="sub-header bold">{name}</h2>
        <p className="text">{description}</p>
      </div>
      <div className="w-1/5 flex items-center justify-end">
        <CustomCheckbox scale={2} />
      </div>
    </motion.section>
  );
};

export default RaceCard;