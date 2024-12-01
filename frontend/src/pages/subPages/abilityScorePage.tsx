import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import AbilityScoreCard from '../../components/SubPages/AbilityScoreCard.tsx';
import useCharacterContext from '../../hooks/useCharacter.ts';
import { useToast } from '../../hooks/useToast.ts';
import abilityScoreManagement from '../../utils/abilityScoreManagement.ts';

/**
 * AbilityScorePage Component
 *
 * A dedicated page for managing character ability scores in a D&D character creation system.
 *
 * Features:
 * - Individual ability score cards for each D&D ability (STR, DEX, etc.)
 * - Score adjustment controls with validation
 * - Associated skills display for each ability
 * - Loading state management
 *
 * Component Architecture:
 * - Uses SubPageLayout for consistent styling
 * - Renders AbilityScoreCard components for each ability
 * - Integrates with CharacterContext for state management
 * - Uses Toast notifications for user feedback
 *
 * State Management:
 * - Abilities state from CharacterContext
 * - Loading states for async operations
 * - Score updating and handling through abilityScoreManagement utility
 *
 * Loading States:
 * - Shows LoadingHourglass during data fetch
 * - Conditional rendering based on abilityScoresLoading flag
 *
 * Props (AbilityScoreCard):
 * - id: Unique identifier for ability
 * - name: Ability name (e.g., "Strength")
 * - index: Sorting/reference index
 * - skills: Associated skills list
 * - score: Current ability score value
 * - onChange: Score change handler
 *
 * @returns  Rendered AbilityScorePage component
 */
export default function AbilityScorePage() {
  const { stateAbilities, loadingStates } = useCharacterContext();
  const { showToast } = useToast();
  const { handleCounterChange, currentArrayScores } = abilityScoreManagement(showToast);
  const { abilityScoresLoading } = loadingStates;

  return (
    <>
      <SubPageLayout>
        {!abilityScoresLoading ? (
          <section className="flex flex-col items-center w-full gap-10">
            {stateAbilities.map((ability, index) => (
              <AbilityScoreCard
                key={`${ability.id}-${index}`}
                id={ability.id}
                name={ability.name}
                index={ability.index}
                skills={ability.skills}
                score={currentArrayScores.get(ability.name) ?? 0}
                onChange={(newValue) => handleCounterChange(ability.name, newValue)}
              />
            ))}
          </section>
        ) : (
          <section className="flex flex-col items-center w-full">
            <LoadingHourglass />
          </section>
        )}
      </SubPageLayout>
    </>
  );
}
