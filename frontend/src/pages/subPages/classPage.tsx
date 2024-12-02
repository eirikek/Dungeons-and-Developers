import ClassCard from '../../components/SubPages/ClassCard.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import { useReactiveVar } from '@apollo/client';

import useCharacterContext from '../../hooks/useCharacter.ts';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import { classVar } from '../../utils/apolloVars.ts';
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
        <section className="flex flex-col items-center w-full">
          <LoadingHourglass />
        </section>
      )}
    </SubPageLayout>
  );
}
