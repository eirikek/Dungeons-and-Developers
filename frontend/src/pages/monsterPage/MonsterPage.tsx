import { Button } from '@mui/material';
import { hourglass } from 'ldrs';
import { useEffect, useMemo, useState } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard';
import Navbar from '../../components/Navbar/Navbar';
import useMonster from '../../hooks/useMonster';

const monstersPerPage = 6;

export default function MonsterPage() {
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch all monsters using the custom hook
  const { allMonsters, isLoading: isLoadingMonsters } = useMonster();

  // Used for loading screen
  hourglass.register();

  const filteredMonsters = useMemo(() => {
    if (!allMonsters) return [];
    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/-/g, ' ');
    return allMonsters.filter((monster) =>
      monster.name.toLowerCase().replace(/-/g, ' ').includes(normalizedSearchTerm)
    );
  }, [allMonsters, searchTerm]);

  // Apply pagination to filtered results
  const totalFilteredMonsters = filteredMonsters.length;
  const totalPages = Math.ceil(totalFilteredMonsters / monstersPerPage);

  const displayedMonsters = useMemo(() => {
    return filteredMonsters.slice(
      (currentPage - 1) * monstersPerPage,
      currentPage * monstersPerPage
    );
  }, [filteredMonsters, currentPage]);

  const handleMonsterLoad = () => {
    setLoadedCount((prevCount) => prevCount + 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    setLoadedCount(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setLoadedCount(0);
  };

  useEffect(() => {
    setCurrentPage(1);
    setLoadedCount(0);
  }, [searchTerm]);

  const isLoading = isLoadingMonsters || loadedCount < displayedMonsters.length;

  return (
    <div className="bg-madmage bg-center bg-cover bg-no-repeat min-h-screen flex flex-col items-center justify-center">
      <Navbar />

      <div className="mt-5"></div>

      <div
        className="flex flex-col items-center justify-center h-full"
        style={{ display: isLoading ? 'block' : 'none' }}
      >
        <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
      </div>

      <div
        className="bg-customGray bg-opacity-80 p-8 rounded-lg shadow-lg w-2/3 tablet:w-10/12 h-auto flex flex-col items-center justify-center mt-10 mb-10"
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <h2 className="text-2xl text-white font-bold mt-10">Monsters</h2>
        <input
          type="text"
          placeholder="Search for a monster..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-3 gap-8 mt-8">
          {displayedMonsters.map((monster) => (
            <MonsterCard
              key={monster.index}
              monsterName={monster.name}
              onLoad={handleMonsterLoad}
            />
          ))}
        </div>

        {totalFilteredMonsters > monstersPerPage && (
          <>
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous Page
            </Button>
            <p>
              Page: {currentPage}/{totalPages}
            </p>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next Page
            </Button>
          </>
        )}
      </div>
    </div>
  );
}