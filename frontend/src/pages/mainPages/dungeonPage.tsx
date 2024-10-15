import { useContext, useState } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput.tsx';
import DungeonMonsterGrid from '../../components/Dungeon/DungeonMonsterGrid.tsx';
import DungeonStats from '../../components/Dungeon/DungeonStats.tsx';
import { DungeonContext } from '../../context/DungeonContext.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';

export default function DungeonPage() {
  const [dungeonName, setDungeonName] = useState(() => {
    const savedName = localStorage.getItem('dungeonName');
    return savedName || 'Enter dungeon name';
  });

  const { dungeonMonsters } = useContext(DungeonContext);

  const handleSaveDungeonName = (newName: string) => {
    setDungeonName(newName);
    localStorage.setItem('dungeonName', newName);
  };

  return (
    <MainPageLayout>
      <main
        className="main before:bg-dungeon xl:h-screen xl:overflow-hidden pb-[3vh]">
        <div className="black-overlay" />
        <div
          className="wrapper min-w-[70%] z-10 mt-[10vh]">
          <CustomInput
            placeholder="Enter dungeon name"
            inputName="Dungeon Name"
            value={dungeonName}
            onSave={handleSaveDungeonName}
          />
          <DungeonStats monsters={dungeonMonsters} />

          <DungeonMonsterGrid />
        </div>
      </main>
    </MainPageLayout>
  );
}
