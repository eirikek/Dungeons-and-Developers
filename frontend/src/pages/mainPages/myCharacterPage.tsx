import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import abilityScoreMap from '../../utils/abilityScoreMapping.ts';
import TutorialModal from '../../components/MyCharacter/TutorialModal.tsx';
import useUserEquipments from '../../hooks/useUserEquipments.ts';
import { useMutation, useQuery } from '@apollo/client';
import { useToast } from '../../hooks/useToast.ts';
import {
  GET_ARRAY_SCORES,
  GET_USER_CLASS,
  GET_USER_RACE,
  UPDATE_ABILITY_SCORES,
  UPDATE_USER_CLASS,
  UPDATE_USER_RACE,
} from '../../../../backend/src/graphql/queries.ts';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.tsx';
import useClasses from '../../hooks/useClasses.ts';
import Counter from '../../components/Counter/Counter.tsx';
import classImageMapping from '../../utils/classImageMapping.ts';
import useRaces from '../../hooks/useRaces.ts';
import raceImageMapping from '../../utils/raceImageMapping.ts';

const MyCharacterPage = () => {
  const { userEquipments } = useUserEquipments();
  const { userId } = useContext(AuthContext);
  const { showToast } = useToast();

  const { data: userClassData } = useQuery(GET_USER_CLASS, {
    variables: { userId },
    skip: !userId,
  });
  const [updateUserClass] = useMutation(UPDATE_USER_CLASS);
  const currentPage = 1;
  const classesPerPage = 12;
  const { classes: classData } = useClasses(currentPage, classesPerPage);
  const [classIndex, setClassIndex] = useState(0);
  const [classImageLoaded, setClassImageLoaded] = useState(false);
  const [hasInteractedScores, setHasInteractedScores] = useState(false);

  const { data, loading } = useQuery(GET_ARRAY_SCORES, {
    variables: { userId },
    fetchPolicy: 'network-only',
  });
  const [updateAbilityScores] = useMutation(UPDATE_ABILITY_SCORES);
  const [localScores, setLocalScores] = useState<number[]>(Array(6).fill(0));
  const [scores, setScores] = useState<number[]>(Array(6).fill(0));

  const { data: userRaceData } = useQuery(GET_USER_RACE, {
    variables: { userId },
    skip: !userId,
  });
  const { races: raceData } = useRaces(currentPage, classesPerPage);
  const [raceImageLoaded, setRaceImageLoaded] = useState(false);
  const [raceIndex, setRaceIndex] = useState(0);
  const [updateUserRace] = useMutation(UPDATE_USER_RACE);

  useEffect(() => {
    if (data && data.getArrayScores) {
      setLocalScores(data.getArrayScores);
    }
  }, [data]);

  useEffect(() => {
    if (userClassData?.user?.class?.id) {
      const selectedIndex = classData.findIndex((c) => c.id === userClassData.user.class.id);
      if (selectedIndex !== -1) setClassIndex(selectedIndex);
    }
  }, [userClassData, classData]);

  useEffect(() => {
    if (userRaceData?.user?.race?.id) {
      const selectedIndex = raceData.findIndex((r) => r.id === userRaceData.user.race.id);
      if (selectedIndex !== -1) setRaceIndex(selectedIndex);
    }
  }, [userRaceData, raceData]);

  const handleCounterChange = (index: number, newValue: number) => {
    const updatedLocalScores = [...localScores];
    updatedLocalScores[index] = newValue;
    setLocalScores(updatedLocalScores);
    setHasInteractedScores(true);
  };

  // Debounced update to the database
  const handleUpdateScores = useCallback(() => {
    if (!hasInteractedScores) return;

    updateAbilityScores({ variables: { userId, scores: localScores } })
      .then(() => {
        localScores.forEach((newScore, index) => {
          if (newScore !== scores[index]) {
            const abilityName = Object.keys(abilityScoreMap).find((key) => abilityScoreMap[key] === index);
            if (abilityName) {
              showToast({
                message: `Value for ${abilityName} changed to ${newScore}`,
                type: 'success',
                duration: 3000,
              });
            }
          }
        });

        setScores(localScores);
      })
      .catch((error) => console.error('Error updating ability scores:', error));
  }, [userId, localScores, scores, hasInteractedScores, updateAbilityScores, showToast]);

  useEffect(() => {
    if (hasInteractedScores) {
      const timer = setTimeout(() => {
        handleUpdateScores();
        setHasInteractedScores(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [localScores, handleUpdateScores, hasInteractedScores]);

  const handleChange = async (type: 'race' | 'class', direction: 'next' | 'prev') => {
    const isRace = type === 'race';
    const data = isRace ? raceData : classData;
    const index = isRace ? raceIndex : classIndex;
    const setIndex = isRace ? setRaceIndex : setClassIndex;
    const updateMutation = isRace ? updateUserRace : updateUserClass;
    const toastType = isRace ? 'Race' : 'Class';

    const newIndex = direction === 'next' ? (index + 1) % data.length : (index - 1 + data.length) % data.length;

    setIndex(newIndex);
    const newItem = data[newIndex];

    try {
      await updateMutation({
        variables: { userId, [`${type}Id`]: newItem.id },
      });
    } catch (error) {
      console.error(`Error updating ${toastType.toLowerCase()}:`, error);
    }
  };

  const currentClass = classData[classIndex];
  const currentClassImage = currentClass ? classImageMapping[currentClass.index] : '';

  const currentRace = raceData[raceIndex];
  const currentRaceImage = currentRace ? raceImageMapping[currentRace.index] : '';

  return (
    <MainPageLayout>
      <main className="main before:bg-myCharacter">
        <div className="black-overlay" />
        <div className="wrapper w-full py-[15vh] gap-32">
          <h1 className="header">My Character</h1>
          <TutorialModal />
          {/* Race section */}
          <section className="w-full flex flex-col lg:flex-row justify-between">
            <article className="w-full xl:w-1/2 flex flex-col items-center">
              <h2 className="header">Race:</h2>
              <div className="flex items-center">
                <button className="arrow-button" onClick={() => handleChange('race', 'prev')}>
                  <FaChevronLeft />
                </button>
                {currentRace && (
                  <article className="flex flex-col justify-center items-center gap-4 min-w-52">
                    <h3 className="sub-header">{currentRace.name}</h3>
                    <div className="flex justify-center items-center w-[70vw] h-[30vh] lg:w-[20vw] lg:h-[25vh] overflow-hidden">
                      {!raceImageLoaded && <div className="flex justify-center w-full">Loading image...</div>}
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
                <button className="arrow-button" onClick={() => handleChange('race', 'next')}>
                  <FaChevronRight />
                </button>
              </div>
            </article>

            {/* Class section */}
            <article className="w-full xl:w-1/2 flex flex-col items-center mt-[10vh] lg:mt-0">
              <h2 className="header">Class:</h2>
              <div className="flex items-center gap-4">
                <button className="arrow-button" onClick={() => handleChange('class', 'prev')}>
                  <FaChevronLeft />
                </button>
                {currentClass && (
                  <article className="flex flex-col items-center gap-4">
                    <h3 className="sub-header">{currentClass.name}</h3>
                    <div className="flex justify-center items-center w-[65vw] h-[25vh] lg:w-[25vw] lg:h-[25vh] overflow-hidden">
                      {!classImageLoaded && <div className="flex justify-center w-full py-24">Loading image...</div>}
                      <img
                        src={currentClassImage}
                        alt={currentClass.name}
                        className="w-full h-full object-contain shadow-none"
                        onLoad={() => setClassImageLoaded(true)}
                        style={{ display: classImageLoaded ? 'block' : 'none' }}
                      />
                    </div>
                  </article>
                )}
                <button className="arrow-button" onClick={() => handleChange('class', 'next')}>
                  <FaChevronRight />
                </button>
              </div>
            </article>
          </section>
          {/* Ability scores section */}
          <article className="flex flex-col items-center w-full">
            <h2 className="header mb-[8vh]">Ability Scores:</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[12vh] gap-x-[25vw]">
              {Object.keys(abilityScoreMap).map((key, index) => (
                <div key={index} className="flex items-center">
                  <label className="sub-header w-32 mr-[85px]">{key}:</label>
                  <Counter
                    scale={1.5}
                    value={localScores[abilityScoreMap[key]]}
                    onChange={(newValue) => handleCounterChange(abilityScoreMap[key], newValue)}
                  />
                </div>
              ))}
            </div>
          </article>

          {/* Equipment section */}
          <article className="flex flex-col items-center w-full mt-10">
            <h2 className="header mb-[5vh]">Equipments:</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[5vh] gap-x-[40vw] xl:gap-y-[10vh]">
              {loading && <div>Loading equipments...</div>}
              {userEquipments.length < 1 && (
                <div className="flex items-center justify-center h-full w-full col-span-full text-center">
                  <p className="sub-header">No equipments selected</p>
                </div>
              )}
              {userEquipments.map((equipment, index) => (
                <li key={index} className="list-disc list-inside sub-header">
                  {equipment.name}
                </li>
              ))}
            </div>
          </article>
        </div>
      </main>
    </MainPageLayout>
  );
};

export default MyCharacterPage;
