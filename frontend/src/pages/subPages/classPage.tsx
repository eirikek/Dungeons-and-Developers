import { useContext } from 'react';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import ClassCard from '../../components/SubPages/ClassCard.tsx';
import { CharacterContext } from '../../context/CharacterContext';

export default function ClassPage() {
  const characterContext = useContext(CharacterContext);

  if (!characterContext) {
    throw new Error('CharacterContext must be used within a CharacterProvider');
  }

  const { classes, selectedClassId, updateClass, loading, error } = characterContext;

  const handleClassSelect = async (classId: string) => {
    await updateClass(classId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading classes.</div>;

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
            selectedClassId={selectedClassId}
            onSelect={handleClassSelect}
          />
        ))}
      </section>
    </SubPageLayout>
  );
}
