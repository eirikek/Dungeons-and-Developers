import React from 'react';
import { motion } from 'framer-motion';
import classImages from '../../utils/classImageMapping.tsx';

interface ClassCardProps {
  name: string;
  hit_die: number;
  index: string;
}

const ClassCard: React.FC<ClassCardProps> = ({ name, hit_die, index }) => {
  const classImage = classImages[index];

  return (
    <motion.section
      className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg bg-opacity-60 mt-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 2, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <img src={classImage} alt={name} className="max-w-60 max-h-80 shadow-none" />
      <div>
        <h2 className="text-3xl">{name}</h2>
        <p className="text-sm">Hit Die: {hit_die}</p>
      </div>
    </motion.section>
  );
};

export default ClassCard;