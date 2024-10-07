import Navbar from '../../components/Navbar/Navbar.tsx';
import CharacterButton from '../../components/CharacterCustomization/CharacterButton.tsx';
import RaceCard from '../../components/CharacterCustomization/RaceCard.tsx';

export default function RacePage(){
  return (
    <>
      <Navbar />
      <section
        className="relative flex items-center justify-center h-screen z-0 before:absolute before:inset-0 before:bg-dessert before:bg-cover before:bg-center before:animate-background-zoom  before:z-0">
        <section className="w-full h-1/4 relative z-10 flex flex-row items-center justify-around">
          <CharacterButton></CharacterButton>
        </section>
      </section>
      <section className="flex flex-col items-center w-full bg-gradient-to-b from-dessertyellow to-black">
          <RaceCard></RaceCard>

      </section>

    </>
  );
}