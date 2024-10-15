import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import raceImageMapping from '../../utils/raceImageMapping.ts';
import classImageMapping from '../../utils/classImageMapping.ts';
import useRaces from '../../hooks/useRaces.ts';
import useClasses from '../../hooks/useClasses.ts';
import useAbilityScores from '../../hooks/useAbilityScores.ts';
import Counter from '../../components/Counter/Counter.tsx';

const MyCharacterPage = () => {
  const raceNames = ['dragonborn', 'dwarf', 'elf', 'gnome', 'half-elf', 'half-orc', 'halfling', 'human', 'tiefling'];
  const classNames = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'];

  const raceData = raceNames.map(useRaces);
  const classData = classNames.map(useClasses);

  const [raceIndex, setRaceIndex] = useState(0);
  const [classIndex, setClassIndex] = useState(0);

  const [raceImageLoaded, setRaceImageLoaded] = useState(false);
  const [classImageLoaded, setClassImageLoaded] = useState(false);

  const handleNextRace = () => setRaceIndex((prevIndex) => (prevIndex + 1) % raceData.length);
  const handlePrevRace = () => setRaceIndex((prevIndex) => (prevIndex - 1 + raceData.length) % raceData.length);

  const handleNextClass = () => setClassIndex((prevIndex) => (prevIndex + 1) % classData.length);
  const handlePrevClass = () => setClassIndex((prevIndex) => (prevIndex - 1 + classData.length) % classData.length);

  const currentRace = raceData[raceIndex];
  const currentClass = classData[classIndex];

  const currentRaceImage = currentRace ? raceImageMapping[currentRace.index] : '';
  const currentClassImage = currentClass ? classImageMapping[currentClass.index] : '';

  // Ability Score Logic
  const abilities = ['cha', 'con', 'dex', 'int', 'str', 'wis'];
  const abilityData = abilities.map(useAbilityScores);
  const [abilityValue, setAbilityValue] = useState([0, 0, 0, 0, 0, 0]);

  const handleAbilityChange = (index: number, newValue: number) => {
    const updatedAbilities = [...abilityValue];
    updatedAbilities[index] = newValue;
    setAbilityValue(updatedAbilities);
  };

  return (
    <MainPageLayout>
      <main
        className="relative flex flex-col items-center justify-center min-h-screen w-full z-0 before:absolute before:inset-0 before:bg-myCharacter before:bg-cover before:bg-center before:z-0">

        <div className="absolute inset-0 w-full h-full bg-black opacity-70" />
        <div
          className="flex flex-col py-20 text-white min-h-[calc(100vh-100px)] w-full z-10  justify-between items-center mt-[5vh] xl:mt-0">
          <h2 className="text-6xl md:text-5xl lg:text-4xl xl:text-3xl 2xl:text-2xl">My Character</h2>
          {/* RACE SECTION */}
          <section className="w-full flex flex-col lg:flex-row justify-between mt-[10vh] xl:mt-0">
            <article className="w-full xl:w-1/2 flex flex-col items-center">
              <h2 className="text-6xl md:text-5xl lg:text-4xl xl:text-3xl 2xl:text-2xl">Race:</h2>
              <div className="flex items-center">
                <button className="text-6xl lg:text-4xl xl:text-3xl text-white hover:text-gray-400"
                        onClick={handlePrevRace}>
                  <FaChevronLeft />
                </button>
                {currentRace && (
                  <article className="flex flex-col justify-center items-center gap-4 min-w-52">
                    <h2 className="text-5xl md:text-4xl lg:text-3xl xl:text-2xl 2xl:text-xl">{currentRace.name}</h2>
                    <div
                      className="flex justify-center items-center w-[70vw] h-[30vh] lg:w-[20vw] lg:h-[25vh] overflow-hidden">
                      {!raceImageLoaded && (
                        <div className="flex justify-center w-full">Loading image...</div>
                      )}
                      <img
                        src={currentRaceImage}
                        alt={currentRace.name}
                        className="w-full h-full object-contain shadow-none"
                        onLoad={() => setRaceImageLoaded(true)}
                        style={{ display: raceImageLoaded ? 'block' : 'none' }}
                      />
                    </div>
                  </article>
                )}
                <button className="text-6xl lg:text-4xl xl:text-3xl text-white hover:text-gray-400"
                        onClick={handleNextRace}>
                  <FaChevronRight />
                </button>
              </div>
            </article>

            {/* Class section */}
            <article className="w-full xl:w-1/2 flex flex-col items-center mt-[10vh] lg:mt-0">
              <h2 className="text-6xl md:text-5xl lg:text-4xl xl:text-3xl 2xl:text-2xl">Class:</h2>
              <div className="flex items-center gap-4">
                <button className="text-6xl lg:text-4xl xl:text-3xl text-white hover:text-gray-400"
                        onClick={handlePrevClass}>
                  <FaChevronLeft />
                </button>
                {currentClass && (
                  <article className="flex flex-col items-center gap-4">
                    <h2 className="text-5xl md:text-4xl lg:text-3xl xl:text-2xl 2xl:text-xl">{currentClass.name}</h2>
                    <div
                      className="flex justify-center items-center w-[65vw] h-[25vh] lg:w-[25vw] lg:h-[25vh] overflow-hidden">
                      {!classImageLoaded && (
                        <div className="flex justify-center w-full py-24">Loading image...</div>
                      )}
                      <img
                        src={currentClassImage}
                        alt={currentClass.name}
                        className="w-full h-full object-contain shadow-none"
                        onLoad={() => setClassImageLoaded(true)} // Update the state when image is loaded
                        style={{ display: classImageLoaded ? 'block' : 'none' }} // Show image only when loaded
                      />
                    </div>
                  </article>
                )}
                <button className="text-6xl lg:text-4xl xl:text-3xl text-white hover:text-gray-400"
                        onClick={handleNextClass}>
                  <FaChevronRight />
                </button>
              </div>
            </article>
          </section>

          {/* Ability scores section */}
          <section className="w-full flex flex-col xl:flex-row justify-around mt-[10vh] xl:mt-[2vh]">
            <article className="flex flex-col items-center w-full xl:w-1/2">
              <h2 className="text-6xl md:text-5xl lg:text-4xl xl:text-3xl 2xl:text-2xl mb-[2vh]">Ability Scores:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[2vh] gap-x-[30vw] xl:gap-x-[10vw]">
                {abilityData.map((ability, index) => (
                  <div key={index} className="flex items-center">
                    <label
                      className="text-5xl md:text-4xl lg:text-3xl xl:text-2xl 2xl:text-lg w-32 sm:mr-16 md:mr-5">{ability.full_name}:</label>
                    <Counter
                      value={abilityValue[index]}
                      onChange={(newValue) => handleAbilityChange(index, newValue)}
                    />
                  </div>
                ))}
              </div>
            </article>

            {/* Equipemnt section */}
            <article className="flex flex-col items-center w-full xl:w-1/2 mt-[10vh] xl:mt-0">
              <h2 className="text-6xl md:text-5xl lg:text-4xl xl:text-3xl 2xl:text-2xl mb-[2vh]">Equipments:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[3vh] gap-x-[50vw] xl:gap-y-[3vh] xl:gap-x-[15vw]">
                {['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'].map((item, index) => (
                  <li key={index}
                      className="list-disc list-inside text-5xl md:text-4xl lg:text-3xl xl:text-2xl 2xl:text-lg">
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
};

export default MyCharacterPage;