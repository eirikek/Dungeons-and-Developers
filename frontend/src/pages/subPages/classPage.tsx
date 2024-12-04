import { useReactiveVar } from '@apollo/client';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import ClassCard from '../../components/SubPages/ClassCard.tsx';

import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import useCharacterContext from '../../hooks/useCharacter.ts';
import { classVar } from '../../utils/apolloVars.ts';

/**
 * ClassPage Component
 *
 * A character class selection page that displays available D&D character classes.
 *
 * Features:
 * - Interactive class selection cards
 * - Persistent class selection state using Apollo reactive variables
 * - Loading state management
 * - Integration with character context for updates
 *
 * State Management:
 * - classVar: Apollo reactive variable for selected class
 * - Uses CharacterContext for class data and updates
 *
 * Component Structure:
 * - Wrapped in SubPageLayout
 * - Renders ClassCard components for each available class
 * - Conditional loading state with LoadingHourglass
 *
 * Props (ClassCard):
 * - id: Unique class identifier
 * - name: Class name
 * - hit_die: Class hit die value
 * - index: Reference index
 * - skills: Available class skills
 * - selectedClassId: Currently selected class
 * - onSelect: Class selection handler
 *
 * Loading States:
 * - Shows LoadingHourglass during class data fetch
 * - Conditional rendering based on classLoading flag
 *
 * @returns Rendered ClassPage component
 */
export default function ClassPage() {
  const currentClass = useReactiveVar(classVar);

  const { classes, updateClass, loadingStates } = useCharacterContext();
  const { classLoading } = loadingStates;

  const handleClassSelect = async (classId: string) => {
    await updateClass(classId);
    classVar(classId);
  };

  return (
    <SubPageLayout>
      {!classLoading ? (
        <section className="flex flex-col items-center w-full gap-10">
          {classes.map((classInfo) => (
            <ClassCard
              key={classInfo.index}
              id={classInfo.id}
              name={classInfo.name}
              hit_die={classInfo.hit_die}
              index={classInfo.index}
              skills={classInfo.skills}
              selectedClassId={currentClass}
              onSelect={handleClassSelect}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center min-h-[380vh] w-full">
          <LoadingHourglass />
        </section>
      )}
    </SubPageLayout>
  );
}
