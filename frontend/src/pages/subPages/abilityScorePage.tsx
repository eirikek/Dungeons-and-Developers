import { useContext, useEffect, useState } from 'react';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';
import { CharacterContext } from '../../context/CharacterContext';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ARRAY_SCORES, UPDATE_ABILITY_SCORES } from '../../graphql/queries';
import { useToast } from '../../hooks/useToast.ts';
import { AuthContext } from '../../context/AuthContext.tsx';
import { notifyScoreChanges } from '../../utils/abilityScoreMapping.ts';
import AbilityScore from '../../interfaces/AbilityScoreProps.ts';

export default function AbilityScorePage() {
  const characterContext = useContext(CharacterContext);

  if (!characterContext) {
    throw new Error('CharacterContext must be used within a CharacterProvider');
  }

  const { abilities, updateAbilities, loading, error } = characterContext;

  const [localScores, setLocalScores] = useState<number[]>([]);

  useEffect(() => {
    if (data && data.getArrayScores) {
      const fetchedScores = data.getArrayScores.map((score: AbilityScore) => score.score);
      setLocalScores(fetchedScores);
      setScores(fetchedScores);
    }
  }, [data]);

  const handleScoreChange = (index: number, newValue: number) => {
    const updatedLocalScores = [...localScores];
    updatedLocalScores[index] = newValue;
    setLocalScores(updatedLocalScores);
    setHasInteracted(true);
  };

  const updateScoresToBackend = useCallback(() => {
    if (!hasInteracted) return;

    updateAbilityScores({
      variables: { userId, scores: localScores },
    })
      .then(() => {
        notifyScoreChanges(localScores, scores, setScores, showToast);
      })
      .catch((error) => {
        console.error('Error updating ability scores:', error);
      });
  }, [hasInteracted, updateAbilityScores, userId, localScores, scores, showToast]);

  useEffect(() => {
    if (hasInteracted) {
      const timer = setTimeout(() => {
        updateScoresToBackend();
        setHasInteracted(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [localScores, updateScoresToBackend]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading abilities.</div>;
  }

  return (
    <SubPageLayout>
      <section className="flex flex-col items-center w-full gap-10">
        {abilities.map((ability, index) => (
          <AbilityScoreCard
            key={ability.index}
            id={ability.id}
            name={ability.name}
            skills={ability.skills}
            score={localScores[index]}
            onChange={(newValue) => handleScoreChange(index, newValue)}
          />
        ))}
      </section>
      <button onClick={saveScores} className="btn-primary">
        Save Scores
      </button>
    </SubPageLayout>
  );
}
