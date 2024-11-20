import { motion } from 'framer-motion';
import React from 'react';
import AbilityScoreCardProps from '../../interfaces/AbilityScoreProps.ts';
import Counter from '../Counter/Counter.tsx';

const AbilityScoreCard: React.FC<AbilityScoreCardProps & { score: number; onChange: (value: number) => void }> = ({
  name,
  skills = [],
  score,
  onChange,
}) => {
  return (
    <motion.section
      className="flex flex-col xl:flex-row xl:h-[400px] 2xl:h-[350px] w-full justify-between items-center p-8 xl:p-12 rounded-lg bg-black bg-opacity-90 gap-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div className="flex items-center gap-16 xl:flex-row flex-col">
        <h2 className="sub-header">{name}</h2>
        <Counter
          value={score}
          onChange={(newValue) => console.log('Local update:', newValue)}
          scale={1.5}
          onValueFinalized={(finalValue) => onChange(finalValue)}
        />
      </div>

      <ul className="w-full justify-start xl:w-auto xl:justify-center xl:min-w-[15vw] 2xl:min-w-[10vw] text-center xl:text-left">
        <li className="bold text">Skills required:</li>
        {skills.map((skill, skillIndex) => (
          <li key={skillIndex} className="text">
            {skill}
          </li>
        ))}
      </ul>
    </motion.section>
  );
};

export default AbilityScoreCard;
