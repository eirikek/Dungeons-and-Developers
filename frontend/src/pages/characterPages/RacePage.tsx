import useRaces from '../../hooks/useRaces.ts';
import RaceCard from '../../components/CharacterCustomization/RaceCards.tsx';
import imageMapping from '../../utils/raceImagesMapping.tsx';
import SubPageLayout from '../../components/Layouts/SubPageLayout.tsx';

export default function RacePage() {
  const races = ['dragonborn', 'dwarf', 'elf', 'gnome', 'half-elf', 'half-orc', 'halfling', 'human', 'tiefling'];
  const raceData = races.map(useRaces);

  return (
    <SubPageLayout>
      <section className="flex flex-col items-center w-full bg-gradient-to-b from-dessertyellow to-black">
        {raceData.map((race, index) => (
          <RaceCard
            key={index}
            name={race.name}
            description={`Alignment: ${race.alignment}`}
            imageUrl={imageMapping[race.index]}
          />
        ))}
      </section>
    </SubPageLayout>
  );
}