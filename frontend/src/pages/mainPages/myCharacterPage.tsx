import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Counter from '../../components/Counter/Counter.tsx';
import React, { useEffect, useState } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import raceImageMapping from '../../utils/raceImageMapping.ts';
import classImageMapping from '../../utils/classImageMapping.ts';
import useRaces from '../../hooks/useRaces.ts';
import useClasses from '../../hooks/useClasses.ts';
import useAbilityScores from '../../hooks/useAbilityScores.ts';

interface Race {
  name: string;
  index: string;
}

interface MyCharacterProps {
  raceChange: (selectedRace: Race) => void;
  classChange: (selectedClass: Class) => void;
}

interface Class {
  name: string;
  index: string;
}

const MyCharacterPage: React.FC<MyCharacterProps> = ({ raceChange, classChange }) => {

  const abilities = ['cha', 'con', 'dex', 'int', 'str', 'wis'];
  const abilityData = abilities.map(useAbilityScores);
  const [abilityValue, setAbilityValue] = useState([0, 0, 0, 0, 0, 0]);

  // Race state and handler
  const [races, setRaces] = useState<Race[]>([]);
  const [raceIndex, setRaceIndex] = useState(0);

  const handleAbilityChange = (index: number, newValue: number) => {
    const updatedAbilities = [...abilityValue];
    updatedAbilities[index] = newValue;
    setAbilityValue(updatedAbilities);
  };

  const handleNextPageRace = () => {
    setRaceIndex((prevIndex) => (prevIndex + 1) % races.length);
    raceChange(races[raceIndex]);
  };

  const handlePrevPageRace = () => {
    setRaceIndex((prevIndex) => (prevIndex - 1 + races.length) % races.length);
    raceChange(races[raceIndex]);
  };

  const currentRace = races[raceIndex];
  const currentRaceImage = currentRace ? raceImageMapping[currentRace.index] : '';

  const dragonborn = useRaces('dragonborn');
  const dwarf = useRaces('dwarf');
  const elf = useRaces('elf');
  const gnome = useRaces('gnome');
  const half_elf = useRaces('half-elf');
  const half_orc = useRaces('half-orc');
  const halfling = useRaces('halfling');
  const human = useRaces('human');
  const tiefling = useRaces('tiefling');

  useEffect(() => {
    const fetchedRaces = [
      dragonborn,
      dwarf,
      elf,
      gnome,
      half_elf,
      half_orc,
      halfling,
      human,
      tiefling,
    ];

    // Only set races if the fetched data has changed
    if (JSON.stringify(fetchedRaces) !== JSON.stringify(races)) {
      setRaces(fetchedRaces);
    }
  }, [
    dragonborn,
    dwarf,
    elf,
    gnome,
    half_elf,
    half_orc,
    halfling,
    human,
    tiefling,
    races,
  ]);


  // Class state and handler
  const [classes, setClasses] = useState<Class[]>([]);
  const [classIndex, setClassIndex] = useState(0);

  const handleNextPageClass = () => {
    setClassIndex((prevIndex) => (prevIndex + 1) % classes.length);
    classChange(classes[classIndex]);
  };

  const handlePrevPageClass = () => {
    setClassIndex((prevIndex) => (prevIndex - 1 + classes.length) % classes.length);
    classChange(classes[classIndex]);
  };

  const currentClass = classes[classIndex];
  const currentClassImage = currentClass ? classImageMapping[currentClass.index] : '';

  const barbarianName = useClasses('barbarian');
  const bardName = useClasses('bard');
  const clericName = useClasses('cleric');
  const druidName = useClasses('druid');
  const fighterName = useClasses('fighter');
  const monkName = useClasses('monk');
  const paladinName = useClasses('paladin');
  const rangerName = useClasses('ranger');
  const rogueName = useClasses('rogue');
  const sorcererName = useClasses('sorcerer');
  const warlockName = useClasses('warlock');
  const wizardName = useClasses('wizard');

  useEffect(() => {
    const fetchedClasses = [
      barbarianName,
      bardName,
      clericName,
      druidName,
      fighterName,
      monkName,
      paladinName,
      rangerName,
      rogueName,
      sorcererName,
      warlockName,
      wizardName,
    ];

    // Only set classes if the fetched data has changed
    if (JSON.stringify(fetchedClasses) !== JSON.stringify(classes)) {
      setClasses(fetchedClasses);
    }
  }, [
    barbarianName,
    bardName,
    clericName,
    druidName,
    fighterName,
    monkName,
    paladinName,
    rangerName,
    rogueName,
    sorcererName,
    warlockName,
    wizardName,
    classes,
  ]);


  return (
    <MainPageLayout>
      <main
        className="relative flex flex-col items-center justify-center min-h-screen w-full z-0 before:absolute before:inset-0 before:bg-myCharacter before:bg-cover before:bg-center before:z-0">
        <div className="absolute inset-0 w-full h-full bg-black opacity-70" />
        <div
          className="flex flex-col justify-between py-10 text-white min-h-[calc(100vh-100px)] min-w-[90%] z-10 mt-24">

          <section className="w-full flex justify-center items-center">
            <h1 className="text-4xl text-white tracking-widest">CHARACTER NAME</h1>
          </section>

          <section className="w-full flex justify-between">

            <article className="w-full xl:w-1/2 flex flex-col items-center">
              <h2 className="text-3xl mb-8">Race:</h2>
              <div className="flex items-center justify-between gap-4">
                <button className="text-4xl text-white hover:text-gray-400" onClick={handlePrevPageRace}>
                  <FaChevronLeft />
                </button>
                {currentRace && (
                  <article className="flex flex-col justify-center items-center gap-4 min-w-52">
                    <h2 className=" text-2xl flex">{currentRace.name}</h2>
                    <img src={currentRaceImage} alt="Character" className="max-h-52 shadow-none" />
                  </article>
                )}
                <button className="text-4xl text-white hover:text-gray-400" onClick={handleNextPageRace}>
                  <FaChevronRight />
                </button>
              </div>
            </article>

            <article className="w-full xl:w-1/2 flex flex-col items-center">
              <h2 className="text-3xl mb-8">Class:</h2>
              <div className="flex items-center gap-4">
                <button className="text-4xl text-white hover:text-gray-400" onClick={handlePrevPageClass}>
                  <FaChevronLeft />
                </button>
                {currentClass && (
                  <article className="flex flex-col items-center gap-4">
                    <h2 className="flex text-2xl">{currentClass.name}</h2>
                    <div
                      className="flex justify-center items-center w-52 h-52 overflow-hidden">
                      <img
                        src={currentClassImage}
                        alt="Character"
                        className="w-full h-full object-contain shadow-none"
                      />
                    </div>
                  </article>
                )}
                <button className="text-4xl text-white hover:text-gray-400" onClick={handleNextPageClass}>
                  <FaChevronRight />
                </button>
              </div>
            </article>
          </section>

          <section className="w-full flex xl:flex-row justify-between">
            <article className="flex flex-col items-center w-full xl:w-1/2">
              <h2 className="text-3xl mb-8">Ability Scores:</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-40">
                {abilityData.map((ability, index) => (
                  <div key={index} className="flex items-center">
                    <label className="text-lg w-32">{ability.full_name}:</label>
                    <Counter
                      value={abilityValue[index]}
                      onChange={(newValue) => handleAbilityChange(index, newValue)}
                    />
                  </div>
                ))}
              </div>
            </article>

            <article className="flex flex-col items-center w-full xl:w-1/2">
              <h2 className="text-3xl mb-8">Equipments:</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-10 gap-x-40">
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
};

export default MyCharacterPage;