export type ToastFunction = (options: { message: string; type: 'success' | 'error'; duration: number }) => void;
const abilityScoreMap: { [key: string]: number } = {
  Charisma: 0,
  Constitution: 1,
  Dexterity: 2,
  Intelligence: 3,
  Strength: 4,
  Wisdom: 5,
};

export function notifyScoreChanges(
  localScores: Map<string, number>,
  reactiveVar: Map<string, number>,
  updateReactiveVar: (newScores: Map<string, number>) => void,
  showToast: ToastFunction
) {
  const updatedScores = new Map(reactiveVar);

  localScores.forEach((newScore, abilityName) => {
    const currentScore = reactiveVar.get(abilityName) ?? 0;

    if (newScore !== currentScore) {
      updatedScores.set(abilityName, newScore);

      showToast({
        message: `Value for ${abilityName} changed to ${newScore}`,
        type: 'success',
        duration: 3000,
      });
    }
  });
  updateReactiveVar(localScores);
}

export default abilityScoreMap;
