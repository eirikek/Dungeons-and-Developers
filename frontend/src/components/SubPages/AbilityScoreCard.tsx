import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Counter from '../Counter/Counter.tsx';
import AbilityScoreCardProps from '../../interfaces/AbilityScoreProps.ts';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ARRAY_SCORES, UPDATE_ABILITY_SCORES } from '../../../../backend/src/graphql/queries.ts';
import { AuthContext } from '../../context/AuthContext.tsx';
import abilityScoreMap from '../../utils/abilityScoreMapping.ts';
import { useToast } from '../../hooks/useToast.ts';

const AbilityScoreCard: React.FC<AbilityScoreCardProps> = ({ name, skills = [] }) => {
  const [updateAbilityScores] = useMutation(UPDATE_ABILITY_SCORES);
  const { userId } = useContext(AuthContext);
  const { showToast } = useToast();
  const { data, loading, error } = useQuery(GET_ARRAY_SCORES, {
    variables: { userId },
    fetchPolicy: 'network-only',
  });
  const [scores, setScores] = useState<number[]>(data?.abilityScores || Array(6).fill(0));

  useEffect(() => {
    if (data && data.getArrayScores) {
      setScores(data.getArrayScores);
    }
  }, [data]);

  const index = abilityScoreMap[name.toUpperCase() as keyof typeof abilityScoreMap];

  const handleCounterChange = async (newValue: number) => {
    const updatedScores = [...scores];
    updatedScores[index] = newValue;
    setScores(updatedScores);

    try {
      await updateAbilityScores({ variables: { userId, scores: updatedScores } });
    } catch (error) {
      console.error('Error updating ability scores:', error);
    }
  };

  const showEndToast = () => {
    showToast({
      message: `Value for ${name} changed to ${scores[index]}`,
      type: 'success',
      duration: 3000,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading ability scores.</div>;
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
          value={scores[index]}
          onChange={handleCounterChange}
          scale={1.5}
          onPointerUp={showEndToast}
          onMouseUp={showEndToast}
        />
      </div>

      <ul className="w-full justify-start xl:w-auto xl:justify-center xl:min-w-[15vw] 2xl:min-w-[10vw] text-center xl:text-left">
        <li className="bold text">Skills required:</li>
        {skills.map((skill, index) => (
          <li key={index} className="text">
            {skill}
          </li>
        ))}
      </ul>
    </motion.section>
  );
};

export default AbilityScoreCard;
