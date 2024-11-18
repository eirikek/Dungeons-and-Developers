import { useContext, useEffect, useState } from 'react';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';
import { CharacterContext } from '../../context/CharacterContext';

export default function AbilityScorePage() {
  const characterContext = useContext(CharacterContext);

  if (!characterContext) {
    throw new Error('CharacterContext must be used within a CharacterProvider');
  }

  const { abilities, updateAbilities, loading, error } = characterContext;

  const [localScores, setLocalScores] = useState<number[]>([]);

  useEffect(() => {
    setLocalScores([...abilities.map((ability) => ability.score)]); // Initialize scores
  }, [abilities]);

  const handleScoreChange = (index: number, newValue: number) => {
    const updatedScores = [...localScores];
    updatedScores[index] = newValue;
    setLocalScores(updatedScores); // Update local state
  };

  const saveScores = async () => {
    if (JSON.stringify(localScores) !== JSON.stringify(abilities.map((ability) => ability.score))) {
      await updateAbilities(localScores); // Save scores to backend
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading abilities.</div>;

  return (
    <SubPageLayout>
      <section className="flex flex-col items-center w-full gap-10">
        {abilities.map((ability, index) => (
          <AbilityScoreCard
            key={index}
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
