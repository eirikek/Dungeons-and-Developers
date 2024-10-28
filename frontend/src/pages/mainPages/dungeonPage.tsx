import { useState } from 'react';
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
      <main
        className="main before:bg-dungeon xl:h-screen xl:overflow-hidden">
        <div className="black-overlay" />
        <div
          className="wrapper min-w-[70%] mt-[10vh] !justify-start">
          <CustomInput
            placeholder="Enter dungeon name"
            inputName="Dungeon Name"
            value={dungeonName}
            onSave={handleSaveDungeonName}
          />

          <DungeonMonsterGrid />
        </div>
      </main>
    </MainPageLayout>
  );
}
