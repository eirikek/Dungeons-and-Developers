import CustomInput from '../../components/CustomInput/CustomInput.tsx';
import MonsterGrid from '../../components/Dungeon/MonsterGrid.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';

import { useQuery, useReactiveVar } from '@apollo/client';
import DungeonStats from '../../components/Dungeon/DungeonStats.tsx';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import { GET_USER_DUNGEON_NAME } from '../../graphql/queries/userQueries.ts';
import useDungeon from '../../hooks/useDungeon.ts';
import { dungeonMonstersVar } from '../../utils/apolloVars.ts';
import { handleError } from '../../utils/handleError.ts';

/**
 * DungeonPage Component
 *
 * Displays the user's dungeon, allowing management of its name and the monsters within it.
 *
 * Features:
 * - Displays the user's dungeon name and allows updating it via a custom input field.
 * - Shows stats and monsters added to the dungeon.
 * - Handles loading states and errors during data fetching.
 * - Integrates with Apollo Client to fetch and manage data related to the dungeon.
 *
 * Key Components:
 * - `CustomInput`: For editing and saving the dungeon name.
 * - `DungeonStats`: Displays total HP of the monsters in the dungeon.
 * - `MonsterGrid`: Shows a grid of monsters in the dungeon.
 * - `LoadingHourglass`: A loading spinner displayed while data is being fetched.
 * - `MainPageLayout`: A consistent layout wrapper for the main content.
 *
 * Hooks:
 * - `useQuery`: Fetches the dungeon name using `GET_USER_DUNGEON_NAME`.
 * - `useReactiveVar`: Reactively manages dungeon monster data using `dungeonMonstersVar`.
 * - `useDungeon`: Provides utilities to manage the dungeon's state, including `toggleDungeonName`.
 *
 * Error Handling:
 * - Utilizes `handleError` to log and display errors encountered during dungeon name fetching.
 *
 * States:
 * - `dungeonMonsters`: A reactive variable holding the list of monsters in the dungeon.
 * - `dungeonName`: The name of the dungeon fetched from the server.
 *
 */

export default function DungeonPage() {
  const { toggleDungeonName, userId } = useDungeon();

  const dungeonMonsters = useReactiveVar(dungeonMonstersVar);

  const {
    data: dungeonData,
    error: nameError,
    loading,
  } = useQuery(GET_USER_DUNGEON_NAME, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only',
    notifyOnNetworkStatusChange: false,
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
          {dungeonMonsters.length === 0 && !loading && (
            <section className="align-middle text-center mt-10 min-h-[380vh] w-full">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl">No monsters in dungeon!</h2>
            </section>
          )}
          {loading ? (
            <section className="flex flex-col items-center min-h-[380vh] w-full">
              <LoadingHourglass />
            </section>
          ) : (
            <>
              <DungeonStats />
              <MonsterGrid isDungeonPage={true} />
            </>
          )}
        </div>
      </main>
    </MainPageLayout>
  );
}
