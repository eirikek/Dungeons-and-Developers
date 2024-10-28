import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Counter from '../Counter/Counter.tsx';


interface AbilityScoreCardProps {
  name: string;
  description: string;
  skills: {
    name: string;
    index: string;
  }[];

}

const AbilityScoreCard: React.FC<AbilityScoreCardProps> = ({ name, description, skills }) => {
  // Add state to keep track of the ability score value
  const [score, setScore] = useState<number>(0);

  // Handle value changes for the counter
  const handleCounterChange = (newValue: number) => {
    setScore(newValue); // Update the score state
  };

  return (
    <motion.section
      className="flex flex-col xl:flex-row xl:h-[400px] 2xl:h-[350px] w-full justify-between items-center p-8 xl:p-12 rounded-lg bg-black bg-opacity-80 gap-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: 'circInOut' }}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {/* Display the ability name */}
      <h2 className="sub-header">{name}</h2>

      {/* Counter component */}
      <Counter value={score} onChange={handleCounterChange} scale={1.5} />

      {/* Display the ability description */}
      <p className="text">"{description}"</p>

      {/* Display the skills associated with the ability */}
      <ul className="w-full justify-start xl:w-auto xl:justify-center xl:min-w-[15vw] 2xl:min-w-[10vw]">
        <li className="bold text">Skills required:</li>
        {skills.map((skill) => (
          <li key={skill.index}>{skill.name}</li>
        ))}


      </ul>
    </motion.section>
  );
};

export default AbilityScoreCard;


