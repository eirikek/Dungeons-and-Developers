import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

import Monsters from '../data/mockup.ts';
import { useEffect, useState } from 'react';
import '../components/MonsterCard/MonsterCard.css';

export default function DungeonPage() {
  const name: string = 'The sunken citadel';
  const [monsters, setMonsters] = useState(Monsters.results);

  useEffect(() => {
    setMonsters(monsters.slice(0, 6));
  }, [monsters]);
  return (
    <>
      <main className="flex flex-col text-center gap-20">
        <header className="mt-8 flex flex-col gap-6 items-center">
          {/*
          Add image wiht object-cover:fit
          */}
          <h1 className="text-6xl">Dungeon creator</h1>
          <span className="flex flex-row gap-4">
            <h4 className="text-4xl">{name}</h4>
            <button className="btn btn-reset hover:cursor-pointer rounded-lg hover:bg-customRed hover:text-white">
              <ModeEditOutlineIcon fontSize="large" />
            </button>
          </span>
        </header>
        <section className="flex flex-col items-center">
          {/*<h5 className="text-2xl w-1/2">Your dungeon monsters</h5>*/}
          {/*
          Add difficulty section -> check figma
          */}
        </section>
        <section className="grid grid-cols-3 items-center justify-center">
          {monsters.map((monster, index) => (
            <div key={index} className="card">
              <p>{monster.name}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
