import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import SaveIcon from '@mui/icons-material/Save';
import Monsters from '../../../data/mockup.ts';
import '../../../components/MonsterCard/MonsterCard.css';
import Navbar from '../../../components/Navbar/Navbar.tsx';
import React, { useEffect, useRef, useState } from 'react';

export default function DungeonPage() {
  const [monsters, setMonsters] = useState(Monsters.results.slice(0, 6));
  const dungeonNamePlaceholder = 'Enter dungeon name';
  const [dungeonName, setDungeonName] = useState(() => {
    const savedName = localStorage.getItem('dungeonName');
    return savedName || dungeonNamePlaceholder;
  });
  const [isEditing, setIsEditing] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dungeonName != dungeonNamePlaceholder) {
      localStorage.setItem('dungeonName', dungeonName);
    }
  }, [dungeonName]);

  const dungeonNameRef = useRef<HTMLInputElement>(null);

  const handleDungeonClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const currentValue = dungeonNameRef.current?.value.trim() || '';

    if (currentValue === '' || currentValue === dungeonNamePlaceholder) {
      alert('Dungeon name cannot be empty!');
      setDungeonName(dungeonNamePlaceholder);
    } else {
      setDungeonName(dungeonName);
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSaveClick();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newName = e.target.value;

    if (newName.length > 20) {
      newName = newName.substring(0, 20);
    }
    setDungeonName(newName);
  };

  // For modal (each monster):
  // const handleClose = () => {
  //   setIsOpen(!isOpen);
  // };

  return (
    <section className="min-h-screen flex flex-col bg-storm_giant bg-cover bg-center bg-no-repeat relative">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center relative z-10">
        <article className="w-full max-w-7xl mx-auto px-4 py-8">
          <header className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl text-white font-bold mb-4">Dungeon creator</h1>
          </header>
          <section className="bg-customGray bg-opacity-50 p-8 rounded-lg shadow-lg">
            <header className="flex flex-row items-center justify-center gap-4 mb-8">
              {isEditing ? (
                <input
                  ref={dungeonNameRef}
                  type="text"
                  defaultValue={dungeonName === dungeonNamePlaceholder ? '' : dungeonName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  className="focus:outline-customRed focus:ring-customRed  text-xl font-bold text-center"
                />
              ) : (
                <h2 className="text-3xl md:text-4xl text-white font-semibold">{dungeonName}</h2>
              )}

              <button
                className="p-2 rounded-lg hover:bg-white transition-colors duration-300 group"
                aria-label="Edit dungeon name"
                onClick={isEditing ? handleSaveClick : handleDungeonClick}
              >
                {isEditing ? (
                  <SaveIcon fontSize="large" className="text-white group-hover:text-black duration-100" />
                ) : (
                  <ModeEditOutlineIcon fontSize="large" className="text-white group-hover:text-black duration-100" />
                )}
              </button>
            </header>
            {/*
            Add difficulty section -> check figma
            */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
              {monsters.map((monster, index) => (
                <li
                  key={index}
                  className="bg-customRed p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-white text-lg">{monster.name}</h3>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
    </section>
  );
}
