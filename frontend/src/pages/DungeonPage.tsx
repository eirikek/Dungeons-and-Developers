import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

import Monsters from '../data/mockup.ts';
import '../components/MonsterCard/MonsterCard.css';
import Navbar from '../components/Navbar/Navbar.tsx';
import { useState } from 'react';

export default function DungeonPage() {
  const name: string = 'The sunken citadel';
  const [monsters, setMonsters] = useState(Monsters.results.slice(0, 6));
  return (
    <>
      <Navbar />
      <main className="relative flex flex-col text-center items-center mt-14 bg-storm_giant bg-cover h-screen before:absolute before:inset-0 before:bg-black before:opacity-70 before:z-0">
        <section className="relative flex flex-col items-center gap-20 z-10">
          <header className="mt-8 flex flex-col gap-10 items-center">
            <h1 className="text-6xl text-white">Dungeon creator</h1>
          </header>
          <section className="flex flex-col items-center gap-12 bg-customGray">
            <span className="flex flex-row gap-4">
              <h4 className="text-4xl text-white">{name}</h4>
              <button className="btn btn-reset hover:cursor-pointer rounded-lg hover:bg-customRed group">
                <ModeEditOutlineIcon fontSize="large" className="text-white group-hover:text-black" />
              </button>
            </span>
            {/*
          Add difficulty section -> check figma
          */}
            <section className="grid grid-cols-3 items-center justify-center gap-8">
              {monsters.map((monster, index) => (
                <div key={index} className="card">
                  <p>{monster.name}</p>
                </div>
              ))}
            </section>
          </section>
        </section>
      </main>
    </>
  );
}
