
import Navbar from '../../components/Navbar/Navbar.tsx';
import CharacterButton from '../../components/CharacterCustomization/CharacterButton.tsx';

export default function ClassPage(){
  return (
    <>
      <section className="relative flex items-center justify-center h-screen z-0 before:absolute before:inset-0 before:bg-owlbeast before:bg-cover before:bg-center before:animate-background-zoom  before:z-0">
        <Navbar />
        <section className="w-full h-1/4 relative z-10 flex flex-row items-center justify-around">
          <CharacterButton></CharacterButton>
        </section>
      </section>
      <section className="h-screen w-full bg-gradient-to-b from-owlblue to-black">


      </section>

    </>
  );
}