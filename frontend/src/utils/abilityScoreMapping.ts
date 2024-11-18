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
  localScores: number[],
  scores: number[],
  setScores: (newScores: number[]) => void,
  showToast: ToastFunction
) {
  localScores.forEach((newScore, index) => {
    if (newScore !== scores[index]) {
      const abilityName = Object.keys(abilityScoreMap).find((key) => abilityScoreMap[key] === index);
      if (abilityName) {
        showToast({
          message: `Value for ${abilityName} changed to ${newScore}`,
          type: 'success',
          duration: 3000,
        });
      }
    }
  });

  setScores(localScores);
}

export default abilityScoreMap;
