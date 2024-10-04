import React, { useState, useEffect } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard.tsx';
import mockup from '../../data/mockup.ts';
import Navbar from '../../components/Navbar/Navbar.tsx';

const monsterNameArray: string[] = mockup.results.map((result: any) => result.index);
const monsterNameArray20: string[] = monsterNameArray.slice(0, 6);

export default function MonsterPage() {
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const totalMonsters = monsterNameArray20.length;

  const handleMonsterLoad = () => {
    setLoadedCount((prevCount) => {
      const newCount = prevCount + 1;
      console.log(`Loaded ${newCount} out of ${totalMonsters} monsters`);
      return newCount;
    });
  };

  const isLoading = loadedCount < totalMonsters;

  return (
    <div className="bg-madmage bg-center bg-cover bg-no-repeat min-h-screen flex flex-col items-center justify-center">
      <Navbar />

      <div
        className="flex flex-col items-center justify-center h-full"
        style={{ display: isLoading ? 'block' : 'none' }}
      >
        <p className="text-white text-xl font-bold">
          Loading monsters... ({loadedCount} / {totalMonsters})
        </p>
      </div>

      <div
        className="bg-customGray bg-opacity-80 p-8 rounded-lg shadow-lg w-2/3 tablet:w-10/12 h-auto flex flex-col items-center justify-center mt-10 mb-10"
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <h2 className="text-2xl text-white font-bold mt-10">Monsters</h2>

        <div className="grid grid-cols-3 gap-8 mt-8">
          {monsterNameArray20.map((monsterName) => (
            <MonsterCard key={monsterName} monsterName={monsterName} onLoad={handleMonsterLoad} />
          ))}
        </div>
      </div>
    </div>
  );
}
