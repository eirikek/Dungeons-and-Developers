import { useEffect, useState, useCallback, useContext } from 'react';
import useAbilityScores from '../../hooks/useAbilityScores.ts';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ARRAY_SCORES, UPDATE_ABILITY_SCORES } from '../../graphql/queries';
import { useToast } from '../../hooks/useToast.ts';
import { AuthContext } from '../../context/AuthContext.tsx';
import { notifyScoreChanges } from '../../utils/abilityScoreMapping.ts';
import AbilityScore from '../../interfaces/AbilityScoreProps.ts';

export default function AbilityScorePage() {
  const { userId } = useContext(AuthContext);
  const { loading, error, abilities } = useAbilityScores(1, 6);
  const { showToast } = useToast();
  const { data } = useQuery(GET_ARRAY_SCORES, { variables: { userId }, fetchPolicy: 'network-only' });
  const [updateAbilityScores] = useMutation(UPDATE_ABILITY_SCORES);

  const [localScores, setLocalScores] = useState<number[]>(Array(6).fill(0));
  const [scores, setScores] = useState<number[]>(Array(6).fill(0));
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (data && data.getArrayScores) {
      const fetchedScores = data.getArrayScores.map((score: AbilityScore) => score.score);
      setLocalScores(fetchedScores);
      setScores(fetchedScores);
    } else {
    }
  }, [data]);

  const handleScoreChange = (index: number, newValue: number) => {
    const updatedScores = [...localScores];
    updatedScores[index] = newValue;
    setLocalScores(updatedScores);
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
  }, [localScores, updateScoresToBackend, hasInteracted]);

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
            index={ability.index}
            skills={ability.skills}
            score={localScores[index]}
            onChange={(newValue) => handleScoreChange(index, newValue)}
          />
        ))}
      </section>
    </SubPageLayout>
  );
}
