import CustomInput from '../../components/CustomInput/CustomInput.tsx';
import MonsterGrid from '../../components/Dungeon/MonsterGrid.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';

import { useQuery } from '@apollo/client';
import DungeonStats from '../../components/Dungeon/DungeonStats.tsx';
import { GET_USER_DUNGEON_NAME } from '../../graphql/queries/userQueries.ts';
import useDungeon from '../../hooks/useDungeon.ts';
import { handleError } from '../../utils/handleError.ts';

export default function DungeonPage() {
  const { toggleDungeonName, userId } = useDungeon();

  const { data: dungeonData, error: nameError } = useQuery(GET_USER_DUNGEON_NAME, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only', // Add this
    notifyOnNetworkStatusChange: false, // Add this
  });

  if (nameError) {
    handleError(nameError, 'An error occured while fetching name', 'critical');
  }

  const dungeonName = dungeonData?.user?.dungeonName || null;

  const handleSaveDungeonName = async (newName: string) => {
    try {
      await toggleDungeonName(newName);
    } catch (error) {
      console.error('Failed to update dungeon name:', error);
    }
  };

  return (
    <MainPageLayout>
      <main className="main xl:before:bg-dungeon xl:h-screen xl:overflow-hidden">
        <div className="black-overlay opacity-60" />
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
