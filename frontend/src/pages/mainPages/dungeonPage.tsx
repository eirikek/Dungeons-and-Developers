import { useContext } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput.tsx';
import DungeonMonsterGrid from '../../components/Dungeon/DungeonMonsterGrid.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';

import { AuthContext } from '../../context/AuthContext.tsx';
import DungeonStats from '../../components/Dungeon/DungeonStats.tsx';
import { DungeonContext } from '../../context/DungeonContext.tsx';

export default function DungeonPage() {
  const { userId } = useContext(AuthContext);
  const { dungeonName, updateDungeonName } = useContext(DungeonContext);

  const handleSaveDungeonName = (newName: string) => {
    if (userId) {
      updateDungeonName(newName);
    }
  };

  return (
    <MainPageLayout>
      <main className="main before:bg-dungeon xl:h-screen xl:overflow-hidden">
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
          <DungeonMonsterGrid />
        </div>
      </main>
    </MainPageLayout>
  );
}
