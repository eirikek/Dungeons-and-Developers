import AbilityScoreCard from '../../components/CharacterCustomization/AbilityScoreCard.tsx';
import CharacterButton from '../../components/CharacterCustomization/CharacterButton.tsx';
import Navbar from '../../components/Navbar/Navbar.tsx';


export default function AbilityScorePage(){
  return (
    <>
      <Navbar />
      <section className="flex items-center justify-end h-screen z-0 before:absolute before:inset-0 before:bg-bluedrake before:bg-cover before:bg-center before:animate-background-zoom  before:z-0">
          <CharacterButton></CharacterButton>
      </section>
      <section className="flex flex-col items-center w-full bg-gradient-to-b from-dragongreen to-black">
        <AbilityScoreCard></AbilityScoreCard>
      </section>

    </>
  );
}