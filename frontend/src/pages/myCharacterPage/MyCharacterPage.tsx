import placeholderImg from '../../assets/my_character_bg.jpg';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button from '../../components/Button/Button.tsx';
import Counter from '../../components/Counter/Counter.tsx';
import { useState } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';

export default function MyCharacterPage() {
  const [abilities, setAbilities] = useState([0, 0, 0, 0, 0, 0]);

  const handleAbilityChange = (index: number, newValue: number) => {
    const updatedAbilities = [...abilities];
    updatedAbilities[index] = newValue;
    setAbilities(updatedAbilities);
  };

  return (
    <MainPageLayout>
      <main
        className="relative flex flex-col items-center justify-center h-screen w-full z-0 before:absolute before:inset-0 before:bg-my_character_bg before:bg-cover before:bg-center before:z-0">
        <div
          className="flex flex-col justify-center items-center bg-black bg-opacity-70 text-white w-5/6 my-20 z-10 gap-10 p-16">

          {/* Top Section: Character Name */}
          <section className="w-full flex justify-center items-center">
            <h1 className="text-3xl text-white tracking-widest">CHARACTER NAME</h1>
          </section>

          {/* Middle Section: Race and Class */}
          <section className="w-full flex laptop:flex-row justify-between">

            {/* Left Section - Race */}
            <article className="w-full xl:w-1/2 flex flex-col items-center">
              <Button text="Race" className="mb-8" />
              <div className="flex items-center gap-4">
                <button className="text-4xl text-white hover:text-gray-400">
                  <FaChevronLeft />
                </button>
                <img src={placeholderImg} alt="Character" className="w-44 h-44 mb-6" />
                <button className="text-4xl text-white hover:text-gray-400">
                  <FaChevronRight />
                </button>
              </div>
            </article>

            {/* Right Section - Class */}
            <article className="w-full xl:w-1/2 flex flex-col items-center">
              <Button text="Class" className="mb-8" />
              <div className="flex items-center gap-4">
                <button className="text-4xl text-white hover:text-gray-400">
                  <FaChevronLeft />
                </button>
                <h2 className="text-2xl">Barbarian</h2>
                <button className="text-4xl text-white hover:text-gray-400">
                  <FaChevronRight />
                </button>
              </div>
            </article>
          </section>

          {/* Bottom Section: Abilities and Equipment */}
          <section className="w-full flex xl:flex-row justify-between">

            {/* Left Section - Ability Class */}
            <article className="flex flex-col items-center w-full xl:w-1/2">
              <Button text="Ability Classes" className="mb-8" />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-40">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-center">
                    <label className="text-lg w-32">Ability {index + 1}:</label>
                    <Counter
                      value={abilities[index]}
                      onChange={(newValue) => handleAbilityChange(index, newValue)}
                    />
                  </div>
                ))}
              </div>
            </article>

            {/* Right Section - Equipment */}
            <article className="flex flex-col items-center w-full xl:w-1/2">
              <Button text="Equipments" className="mb-8" />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-4 gap-x-40">
                {['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'].map((item, index) => (
                  <li key={index} className="list-disc list-inside text-lg">
                    {item}
                  </li>
                ))}
              </div>
            </article>
          </section>
        </div>
      </main>
    </MainPageLayout>
  );
}