import React from 'react';
import { motion } from 'framer-motion';
import classImages from '../../utils/classImageMapping.ts';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

interface ClassCardProps {
  name: string;
  hit_die: number;
  index: string;
  //proficiency_choices: string;
}



const ClassCard: React.FC<ClassCardProps> = ({ name, hit_die, index }) => {
  const classImage = classImages[index];

  return (
    <motion.section
      className="flex flex-col xl:flex-row xl:h-60 w-full justify-between items-center p-8 xl:p-12 rounded-lg bg-black bg-opacity-80 gap-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div className="flex flex-col xl:flex-row gap-5 justify-center items-center">
        <img src={classImage} alt={name} className="max-w-44 shadow-none" />
        <div>
          <h2 className="sub-header bold">{name}</h2>
          <p className="text">HP: {hit_die}</p>
        </div>
      </div>
      <div className="w-1/5 flex items-center justify-center xl:justify-end">
        <CustomCheckbox scale={2} />
      </div>
    </motion.section>
  );
};

export default ClassCard;