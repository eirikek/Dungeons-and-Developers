export type ToastFunction = (options: { message: string; type: 'success' | 'error'; duration: number }) => void;
const abilityScoreMap: { [key: string]: number } = {
  Wisdom: 5,
  Strength: 4,
  Intelligence: 3,
  Dexterity: 2,
  Constitution: 1,
  Charisma: 0,
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
