export default interface AbilityScoreCardProps {
  name: string;               // The name of the ability (e.g., "Strength")
  skills: string[];          // An array of associated skills (e.g., ["Athletics", "Melee"])
  index: number;             // The index for tracking the ability score in the parent state
  score: number;             // The current score for this ability
  onScoreChange: (index: number, newValue: number) => void; // Function to handle score updates
}