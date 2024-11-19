import ClassCard from '../../components/SubPages/ClassCard.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import { makeVar, useReactiveVar } from '@apollo/client';

import useCharacterContext from '../../hooks/useCharacter.ts';

export const classVar = makeVar<string>('');

export default function ClassPage() {
  const currentClass = useReactiveVar(classVar);

  const { classes, updateClass } = useCharacterContext();

  const handleClassSelect = async (classId: string) => {
    await updateClass(classId);
    classVar(classId);
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading classes.</div>;

  return (
    <SubPageLayout>
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
    </SubPageLayout>
  );
}
