import { useContext } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput.tsx';
import MonsterGrid from '../../components/Dungeon/MonsterGrid.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';

import DungeonStats from '../../components/Dungeon/DungeonStats.tsx';
import { DungeonContext } from '../../context/DungeonContext.tsx';

export default function DungeonPage() {
  const { dungeonName, updateDungeonName } = useContext(DungeonContext);

  const handleSaveDungeonName = (newName: string) => {
    updateDungeonName(newName);
  };

  return (
    <MainPageLayout>
      <main className="main xl:before:bg-dungeon xl:h-screen xl:overflow-hidden">
        <div className="black-overlay" />
        <div className="wrapper min-w-[70%] mt-[10vh] h-full !justify-start">
          <CustomInput
            placeholder="Enter dungeon name"
            inputName="Dungeon Name"
            value={dungeonName}
            onSave={handleSaveDungeonName}
            aria-label="Enter dungeon name"
            data-testid="input-for-dungeon-name"
          />
          <DungeonStats />
          <MonsterGrid isDungeonPage={true} />
        </div>
      </main>
    </MainPageLayout>
  );
}
