import '../../components/MonsterCard/MonsterCard.css';
import { useState } from 'react';
import DungeonHeader from '../../components/Dungeon/DungeonHeader.tsx';
import CustomInput from '../../components/CustomInput/CustomInput.tsx';
import DungeonMonsterGrid from '../../components/Dungeon/DungeonMonsterGrid.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';

export default function DungeonPage() {
  const [dungeonName, setDungeonName] = useState(() => {
    const savedName = localStorage.getItem('dungeonName');
    return savedName || 'Enter dungeon name';
  });

  const handleSaveDungeonName = (newName: string) => {
    setDungeonName(newName);
    localStorage.setItem('dungeonName', newName);
  };

  return (
    <MainPageLayout>
      <section className="min-h-screen flex flex-col bg-dungeon bg-cover bg-center bg-no-repeat relative">
        <main className="flex-grow flex flex-col items-center justify-center relative z-10 ">
          <article className="flex flex-col gap-16 items-center w-full max-w-7xl mx-auto">
            <DungeonHeader />
            <section className="bg-customGray bg-opacity-80 p-8 rounded-lg shadow-lg w-2/3 tablet:w-10/12">
              <CustomInput
                placeholder="Enter dungeon name"
                inputName="Dungeon Name"
                value={dungeonName}
                onSave={handleSaveDungeonName}
              />
              <DungeonMonsterGrid />
            </section>
          </article>
        </main>
      </section>
    </MainPageLayout>
  );
}
