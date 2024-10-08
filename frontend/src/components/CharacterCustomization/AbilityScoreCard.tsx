import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
}

interface AbilityScoreCardProps {
  name: string;
  description: string;
  skills: Skill[];
}

const AbilityScoreCard: React.FC<AbilityScoreCardProps> = ({ name, description, skills }) => {
  return (
    <motion.section
      className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg bg-fuchsia-300 bg-opacity-60 mt-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <h2 className="text-3xl">{name}</h2>
      <div>
        <p className="text-sm">" {description} "</p>
        <ul className="text-white">
          Skills:
          {skills.map((skill, index) => (
            <li key={index}>{skill.name}</li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
};

export default AbilityScoreCard;


