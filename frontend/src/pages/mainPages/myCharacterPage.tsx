import { makeVar, useReactiveVar } from '@apollo/client';
import { useContext, useEffect, useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import AbilityCounterWrapper from '../../components/Counter/AbilityScoreCounterWrapper.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout';
import TutorialModal from '../../components/MyCharacter/TutorialModal';
import { equipmentsVar } from '../../context/CharacterContext.tsx';
import useCharacterContext from '../../hooks/useCharacter';
import { AuthContext } from '../../context/AuthContext';
import classImageMapping from '../../utils/classImageMapping';
import raceImageMapping from '../../utils/raceImageMapping';
import abilityScoreManagement from '../../utils/abilityScoreManagement.ts';
import { classVar } from '../subPages/classPage';
import { raceVar } from '../subPages/racePage.tsx';
import { useToast } from '../../hooks/useToast.ts';
import { Equipment } from '../../interfaces/EquipmentProps.ts';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';

export const abilitiesVar = makeVar<Map<string, number>>(new Map());

const MyCharacterPage = () => {
  const { userName } = useContext(AuthContext);
  const { showToast } = useToast();
  const {
    stateAbilities,
    classes,
    races,
    updateClass,
    updateRace,
    removeFromEquipments,
    addToEquipments,
    loadingStates,
  } = useCharacterContext();

  const { handleCounterChange, currentArrayScores } = abilityScoreManagement(showToast);
  const { abilityScoresLoading, equipmentsLoading, raceLoading, classLoading } = loadingStates;

  const currentClass = useReactiveVar(classVar);
  const currentRace = useReactiveVar(raceVar);

  const [classIndex, setClassIndex] = useState(0);
  const [raceIndex, setRaceIndex] = useState(0);
  const [raceImageLoaded, setRaceImageLoaded] = useState(false);
  const [classImageLoaded, setClassImageLoaded] = useState(false);

  const currentClassData = classes?.find((cls) => cls.id === currentClass) ?? null;
  const currentRaceData = races?.find((rcs) => rcs.id === currentRace) ?? null;

  const currentClassImage = currentClassData ? classImageMapping[currentClassData.index] : '';
  const currentRaceImage = currentRaceData ? raceImageMapping[currentRaceData.index] : '';

  const currentEquipments = useReactiveVar(equipmentsVar);
  const undoRemoveRef = useRef<Equipment | null>(null);

  const handleRemoveEquipment = (equipment: Equipment) => {
    undoRemoveRef.current = equipment;
    removeFromEquipments(equipment);

    showToast({
      message: `${equipment.name} removed from your equipments`,
      type: 'info',
      duration: 3000,
      undoAction: () => undoRemoveEquipment(),
    });
  };

  const undoRemoveEquipment = () => {
    if (undoRemoveRef.current) {
      addToEquipments(undoRemoveRef.current);
      showToast({
        message: `${undoRemoveRef.current.name} restored to your equipments`,
        type: 'success',
        duration: 3000,
      });
      undoRemoveRef.current = null;
    }
  };

  useEffect(() => {
    if (!currentClass && classes?.length) {
      classVar(classes[0].id);
    }
  }, [currentClass, classes]);

  useEffect(() => {
    if (!currentRace && races?.length) {
      raceVar(races[0].id);
    }
  }, [races, currentRace]);

  useEffect(() => {
    if (currentClass && classes?.length) {
      const selectedIndex = classes.findIndex((cls) => cls.id === currentClass);
      setClassIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [currentClass, classes]);

  useEffect(() => {
    if (currentRace && races?.length) {
      const selectedIndex = races.findIndex((rcs) => rcs.id === currentRace);
      setRaceIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [currentRace, races]);

  const handleChange = async (type: 'race' | 'class', direction: 'next' | 'prev') => {
    const isRace = type === 'race';
    const data = isRace ? races : classes;
    const index = isRace ? raceIndex : classIndex;
    const setIndex = isRace ? setRaceIndex : setClassIndex;
    const updateFn = isRace ? updateRace : updateClass;

    const newIndex = direction === 'next' ? (index + 1) % data.length : (index - 1 + data.length) % data.length;

    setIndex(newIndex);
    const newItem = data[newIndex];

    try {
      await updateFn(newItem.id);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  return (
    <MainPageLayout>
      <main className="main before:bg-myCharacter">
        <div className="black-overlay" />
        <div className="wrapper w-full py-[15vh] gap-32">
          <h1 className="header">{userName ? `${userName}'s Character` : 'My Character'}</h1>
          <TutorialModal />
          {raceLoading || classLoading || abilityScoresLoading || equipmentsLoading ? (
            <div className="flex justify-center items-center h-[70vh]">
              <LoadingHourglass />
            </div>
          ) : (
            <>
              {/* Race Section */}
              <section className="w-full flex flex-col lg:flex-row justify-between">
                <article className="w-full xl:w-1/2 flex flex-col items-center">
                  <h2 className="header">Race:</h2>
                  <div className="flex items-center">
                    <button className="arrow-button" onClick={() => handleChange('race', 'prev')}>
                      <FaChevronLeft />
                    </button>
                    {currentRaceData && (
                      <div className="flex flex-col justify-center items-center gap-4 min-w-52">
                        <h3 className="sub-header">{currentRaceData.name}</h3>
                        <div className="flex justify-center items-center w-[70vw] h-[30vh] lg:w-[20vw] lg:h-[25vh] overflow-hidden">
                          {!raceImageLoaded && <div className="flex justify-center w-full">Loading image...</div>}
                          <img
                            src={currentRaceImage}
                            alt={currentRaceData.name}
                            className="w-full h-full object-contain shadow-none"
                            onLoad={() => setRaceImageLoaded(true)}
                            style={{ display: raceImageLoaded ? 'block' : 'none' }}
                          />
                        </div>
                      </div>
                    )}
                    <button className="arrow-button" onClick={() => handleChange('race', 'next')}>
                      <FaChevronRight />
                    </button>
                  </div>
                </article>

                {/* Class Section */}
                <article className="w-full xl:w-1/2 flex flex-col items-center mt-[10vh] lg:mt-0">
                  <h2 className="header">Class:</h2>
                  <div className="flex items-center gap-4">
                    <button className="arrow-button" onClick={() => handleChange('class', 'prev')}>
                      <FaChevronLeft />
                    </button>
                    {currentClassData && (
                      <div className="flex flex-col items-center gap-4">
                        <h3 className="sub-header">{currentClassData.name}</h3>
                        <div className="flex justify-center items-center w-[65vw] h-[25vh] lg:w-[25vw] lg:h-[25vh] overflow-hidden">
                          {!classImageLoaded && (
                            <div className="flex justify-center w-full py-24">Loading image...</div>
                          )}
                          <img
                            src={currentClassImage}
                            alt={currentClassData.name}
                            className="w-full h-full object-contain shadow-none"
                            onLoad={() => setClassImageLoaded(true)}
                            style={{ display: classImageLoaded ? 'block' : 'none' }}
                          />
                        </div>
                      </div>
                    )}
                    <button className="arrow-button" onClick={() => handleChange('class', 'next')}>
                      <FaChevronRight />
                    </button>
                  </div>
                </article>
              </section>

              {/* Ability Scores Section */}
              <article className="flex flex-col items-center w-full">
                <h2 className="header mb-[8vh]">Ability Scores:</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[12vh] gap-x-[25vw]">
                  {stateAbilities.map((ability, index) => (
                    <div key={index} className="flex items-center">
                      <label className="sub-header w-32 mr-[85px]">{ability.name}:</label>
                      <AbilityCounterWrapper
                        abilityName={ability.name}
                        initialValue={currentArrayScores.get(ability.name) ?? 0}
                        onUpdate={(newValue) => handleCounterChange(ability.name, newValue)}
                      />
                    </div>
                  ))}
                </div>
              </article>

              {/* Equipment Section */}
              <article className="flex flex-col items-center w-full mt-10">
                <h2 className="header mb-[5vh]">Equipments:</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[5vh] gap-x-[40vw] xl:gap-y-[10vh]">
                  {currentEquipments.length < 1 && (
                    <div className="flex items-center justify-center h-full w-full col-span-full text-center">
                      <p className="sub-header">No equipments added</p>
                    </div>
                  )}
                  {currentEquipments.map((equipment, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <p className="sub-header">{equipment.name}</p>
                      <FaTrash
                        size={30}
                        className="delete-icon text-white cursor-pointer hover:text-customRed transition-colors"
                        onClick={() => handleRemoveEquipment(equipment)}
                      />
                    </li>
                  ))}
                </div>
              </article>
            </>
          )}
        </div>
      </main>
    </MainPageLayout>
  );
};

export default MyCharacterPage;
