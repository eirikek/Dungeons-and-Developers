import ClassCard from '../../components/SubPages/ClassCard.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';
import useClass from '../../hooks/useClasses.ts';

export default function ClassPage() {
  const { loading, error, classes } = useClass(1, 12);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading classes.</div>;

  return (
    <SubPageLayout>
      <section className="flex flex-col items-center w-full gap-10">
        {classes.map((classInfo) => (
          <ClassCard
            id={classInfo.id}
            key={classInfo.index}
            name={classInfo.name}
            hit_die={classInfo.hit_die}
            index={classInfo.index}
            //proficiency_choices = {classInfo.proficiency_choices.join('')}
          />
        ))}
      </section>
    </SubPageLayout>
  );
}
