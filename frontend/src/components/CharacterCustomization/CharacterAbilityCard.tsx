import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
}

interface CharacterAbilityCardProps {
  name: string;
  fullName: string;
  description: string;
  skills: Skill[];
  onSelectChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CharacterAbilityCard: React.FC<CharacterAbilityCardProps> = ({ name, fullName, description, skills, onSelectChange }) => {

  return (
    <motion.section
      className="flex flex-row gap-5 items-center p-8 rounded-lg shadow-lg bg-fuchsia-300 bg-opacity-60 mt-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: 'circInOut'}}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
        <h2 className="text-3xl">{name}</h2>
        <select onChange={onSelectChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <h3 className="text-white">{fullName}</h3>
        <p className="text-sm">" {description} "</p>

        <ul className="text-white">
          Skills:
          {skills.map((skill, index) => (
            <li key={index}>{skill.name}</li>
          ))}
        </ul>
    </motion.section>
      );
      };

      export default CharacterAbilityCard;