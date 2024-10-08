import React from 'react';
import { motion } from 'framer-motion';

interface RaceCardProps {
  name: string;
  description: string;
  imageUrl: string;
}

const RaceCard: React.FC<RaceCardProps> = ({ name, description, imageUrl }) => {
  return (
    <motion.section
      className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg bg-opacity-60 mt-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <img src={imageUrl} alt={name} className="max-w-60 max-h-80 shadow-none" />
      <div>
        <h2 className="text-3xl">{name}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </motion.section>
  );
};

export default RaceCard;