import { useState, useEffect } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard.tsx';
import mockup from '../../data/mockup.ts';
import { hourglass } from 'ldrs';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';

const monsterNameArray: string[] = mockup.results.map((result: any) => result.index);
const monstersPerPage = 8;

export default function MonsterPage() {
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for the search term
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Used for loading screen
  hourglass.register();

  const normalizedSearchTerm = searchTerm.toLowerCase().replace(/-/g, ' ');
  const filteredMonsters = monsterNameArray.filter((monsterName) =>
    monsterName.toLowerCase().replace(/-/g, ' ').includes(normalizedSearchTerm),
  );

  // Apply pagination to filtered results
  const totalFilteredMonsters = filteredMonsters.length;
  const totalPages = Math.ceil(totalFilteredMonsters / monstersPerPage);

  const displayedMonsters = filteredMonsters.slice(
    (currentPage - 1) * monstersPerPage,
    (currentPage - 1) * monstersPerPage + monstersPerPage,
  );

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
  }, [searchTerm]);

  const isLoading = loadedCount < displayedMonsters.length;

  return (
    <MainPageLayout>
      <main
        className="relative flex flex-col items-center justify-center min-h-screen w-full z-0 before:absolute before:inset-0 before:bg-monsters before:bg-cover before:bg-center before:z-0">
        <div className="absolute inset-0 w-full h-full bg-black opacity-70" />

        <div
          className="flex flex-col items-center justify-center h-full"
          style={{ display: isLoading ? 'block' : 'none' }}
        >
          <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
        </div>

        <section
          className="flex flex-col py-10 text-white min-h-[calc(100vh-100px)] min-w-[70%] z-10 mt-24"
          style={{ display: isLoading ? 'none' : 'block' }}
        >
          <div className="relative w-full flex items-center justify-center mb-10">
            {/* Input Field */}
            <div className="absolute left-0">
              <CiSearch size={25} className="absolute left-3 top-1/2 transform -translate-y-[60%] text-gray-400" />
              <input
                type="text"
                placeholder="Search for a monster..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 px-4 py-3 w-72 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
              />
            </div>

            {/* Centered h2 */}
            <h2 className="text-4xl text-center">Monsters</h2>
          </div>

          <div
            className="flex-grow gap-10 w-full overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
            {displayedMonsters.map((monsterName) => (
              <MonsterCard key={monsterName} monsterName={monsterName} onLoad={handleMonsterLoad} />
            ))}
          </div>

          {totalFilteredMonsters > monstersPerPage && (
            <div className="flex justify-center gap-40 w-full text-xl mt-10">
              <button
                className="flex items-center hover:text-gray-400 w-44"
                onClick={(handlePrevPage)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft className="mr-2" />
                Previous Page
              </button>
              <span className="w-2 text-center">{currentPage}</span>
              <button
                className="flex items-center hover:text-gray-400 w-44"
                onClick={handleNextPage}
              >
                Next Page
                <FaChevronRight className="ml-2" />
              </button>
            </div>
          )}
        </section>
      </main>
    </MainPageLayout>
  );
}
