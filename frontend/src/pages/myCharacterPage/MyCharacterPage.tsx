
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button from '../../components/Button/Button.tsx';
import Counter from '../../components/Counter/Counter.tsx';
import React, { useEffect, useState } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import dragonborn from '../../assets/dragonborn.png'
import dwarf from '../../assets/dwarf.png'
import elf from '../../assets/elf.png'
import gnome from '../../assets/gnome.png'
import half_elf from '../../assets/half-elf.png'
import half_orc from '../../assets/half-orc.png'
import halfling from '../../assets/halfling.png'
import human from '../../assets/human.png'
import tiefling from '../../assets/tiefling.png'
import useRaces from '../../hooks/useRaces.ts';
import barbarian from '../../assets/c3barbarianintro.png'
import cleric from '../../assets/c3clericintro.png'
import druid from '../../assets/c3druidintro.png'
import fighter from '../../assets/c3fighterintro.png'
import monk from '../../assets/c3monkintro.png'
import paladin from '../../assets/c3paladinintro.png'
import ranger from '../../assets/c3rangerintro.png'
import rogue from '../../assets/c3rogueintro.png'
import sorcerer from '../../assets/c3sorcererintro.png'
import warlock from '../../assets/c3warlockintro.png'
import wizard from '../../assets/c3wizardintro.png'
import bard from '../../assets/c3bardintro.png'
import useClasses from '../../hooks/useClasses.ts';



//Race
const raceImages: { [key: string]: string } = {
  dragonborn,
  dwarf,
  elf,
  gnome,
  'half-elf': half_elf,
  'half-orc': half_orc,
  halfling,
  human,
  tiefling,


};
interface Race {
  name: string;
  index: string;
}
interface CharacterRaceClassCardProps {
  raceChange: (selectedRace: Race) =>void;
  classChange: (selectedClass: Class) => void;
}
//Class
const classImages: { [key: string]: string } = {
  barbarian,
  cleric,
  druid,
  fighter,
  monk,
  paladin,
  ranger,
  rogue,
  sorcerer,
  warlock,
  wizard,
  bard
};
interface Class{
  name: string;
  index: string;
}




const MyCharacterPage: React.FC<CharacterRaceClassCardProps> = ({ raceChange, classChange }) => {

  const [abilities, setAbilities] = useState([0, 0, 0, 0, 0, 0]);

  //Race
  const [races, setRaces] = useState<Race[]>([])
  const [raceIndex, setRaceIndex] = useState(0);
  const handleAbilityChange = (index: number, newValue: number) => {
    const updatedAbilities = [...abilities];
    updatedAbilities[index] = newValue;
    setAbilities(updatedAbilities);
  };

  const handleNextPageRace = () => {
    if (raceIndex < races.length) {
      setRaceIndex(raceIndex + 1);
    }
    else{
      setRaceIndex(0)
    }
    raceChange(races[raceIndex]);
  };

  const handlePrevPageRace = () => {
    if (raceIndex > 1) {
      setRaceIndex(raceIndex - 1);
    }else(setRaceIndex(races.length-1))
    raceChange(races[raceIndex]);
  };

  const currentRace = races[raceIndex];
  const currentRaceimage = currentRace ? raceImages[currentRace.index] : '';

  const dragonbornName = useRaces("dragonborn")
  const dwarfName = useRaces("dwarf")
  const elfName = useRaces("elf")
  const gnomeName = useRaces("gnome")
  const half_elfName = useRaces("half-elf")
  const half_orcName = useRaces("half-orc")
  const halflingName = useRaces("halfling")
  const humanName = useRaces("human")
  const tieflingName = useRaces("tiefling")

  useEffect(() => {
    setRaces([
      dragonbornName,
      dwarfName,
      elfName,
      gnomeName,
      half_elfName,
      half_orcName,
      halflingName,
      humanName,
      tieflingName,
    ]);
  }, [dragonbornName, dwarfName, elfName, gnomeName, half_elfName, half_orcName, halflingName, humanName, tieflingName]);

  //Class
  const [classes, setClasses] = useState<Class[]>([])
  const [classIndex, setClassIndex] = useState(0);

  const barbarianName = useClasses("barbarian")
  const bardName = useClasses("bard")
  const clericName = useClasses("cleric")
  const druidName = useClasses("druid")
  const fighterName = useClasses("fighter")
  const monkName = useClasses("monk")
  const paladinName = useClasses("paladin")
  const rangerName = useClasses("ranger")
  const rogueName = useClasses("rogue")
  const sorcererName = useClasses("sorcerer")
  const warlockName = useClasses("warlock")
  const wizardName = useClasses("wizard")

  useEffect(() => {
    setClasses([
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
    ]);
  }, [barbarianName,
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
    wizardName,]);

  const handleNextPageClass = () => {
    if (classIndex < classes.length) {
      setClassIndex(classIndex + 1);
    }
    else{
      setClassIndex(0)
    }
    classChange(classes[classIndex]);
  };

  const handlePrevPageClass = () => {
    if (classIndex > 1) {
      setClassIndex(classIndex - 1);
    }else(setClassIndex(classes.length-1))
    classChange(classes[classIndex]);
  };

  const currentClass = classes[classIndex];
  const currentClassImage = currentClass ? classImages[currentClass.index] : '';


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
                <button className="text-4xl text-white hover:text-gray-400" onClick={handlePrevPageRace}>
                  <FaChevronLeft />
                </button>
                {currentRace &&(
                  <article className="flex flex-col items-center gap-4">
                <h2 className=" text-2xl flex">{currentRace.name}</h2>
                <img src={currentRaceimage} alt="Character" className=" flex w-44 h-44 mb-6" />
                </article>
                  )}
                <button className="text-4xl text-white hover:text-gray-400" onClick={handleNextPageRace}>
                  <FaChevronRight />
                </button>
              </div>

            </article>

            {/* Right Section - Class */}
            <article className="w-full xl:w-1/2 flex flex-col items-center">
              <Button text="Class" className="mb-8" />
              <div className="flex items-center gap-4">
                <button className="text-4xl text-white hover:text-gray-400" onClick={handlePrevPageClass}>
                  <FaChevronLeft />

                </button>
                {currentClass &&(
                  <article className="flex flex-col items-center gap-4">
                    <h2 className="flex text-2xl">{currentClass.name}</h2>
                    <img src={currentClassImage} alt="Character" className=" flex w-44 h-44 mb-6" />
                  </article>
                )}
                <button className="text-4xl text-white hover:text-gray-400" onClick={handleNextPageClass}>
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
export default MyCharacterPage;