import { UseQueryResult } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard';
import mockup, { Monster } from '../../data/mockup';
import useMonster, { MonsterCardDataProps } from '../../hooks/useMonster.ts';
import { hourglass } from 'ldrs';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import { CiSearch } from 'react-icons/ci';
import Pagination from '../../components/Pagination/Pagination';

const monsterIndexArray: string[] = mockup.results.map((result: Monster) => result.index);
const monstersPerPage = 8;

export default function MonsterPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Used for loading screen
  hourglass.register();

  const monsterData = useMonster(
    monsterIndexArray,
    debouncedSearchTerm,
    currentPage,
    monstersPerPage,
    false,
  ) as UseQueryResult<MonsterCardDataProps, Error>[];

  const filteredMonsters = useMemo(
    () =>
      debouncedSearchTerm === ''
        ? monsterIndexArray
        : monsterIndexArray.filter((monsterIndex) =>
          monsterIndex.includes(debouncedSearchTerm.toLowerCase().replace(/\s+/g, '-')),
        ),
    [debouncedSearchTerm],
  );

  // Apply pagination to filtered results
  const totalFilteredMonsters = filteredMonsters.length;
  const totalPages = Math.ceil(totalFilteredMonsters / monstersPerPage);

  // Debounce search term updates
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 300),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleMonsterLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  // const allImagesLoaded = loadedImages.size === monsterData.length; Bug: This makes the page just infinitely load if we change page and go back to monster page

  const handlePageChange = useCallback((direction: number) => {
    if ((direction === 1 && currentPage < totalPages) || (direction === -1 && currentPage > 1)) {
      setCurrentPage(currentPage + direction);
      setLoadedImages(new Set());
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
    setLoadedImages(new Set());
  }, [debouncedSearchTerm]);

  const isLoading = monsterData.some((monster) => monster.isLoading);
  const isError = monsterData.some((monster) => monster.isError);

  const displayedMonsters = monsterData.filter((monster) => monster.data && !monster.isLoading && !monster.isError);

  return (
    <MainPageLayout>
      <main
        className="relative flex flex-col items-center justify-center h-screen w-full z-0 before:absolute before:inset-0 before:bg-monsters before:bg-cover before:bg-center before:z-0">
        <div className="absolute inset-0 w-full h-full bg-black opacity-70" />

        {/* Fixed section to prevent movement during search */}
        <section
          className="flex flex-col py-10 text-white min-h-[calc(100vh-100px)] w-[90%] z-10 mt-[5vh] items-center gap-[3vh]"
        >
          <div className="relative flex justify-center items-center">
            <CiSearch size="25" className="absolute left-3 top-1/2 transform -translate-y-[60%] text-gray-400" />
            <input
              type="text"
              placeholder="Search for a monster..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-12 px-[1vw] py-[0.5vh] w-[75vw] sm:w-[60vw] md:w-[40vw] xl:w-[30vw] 2xl:w-[20vw] rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 w-text-2xl xl:text-lg 2xl:text-md"
            />
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-[79.5vh]">
              <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
            </div>
          )}

          <section className={isLoading ? 'hidden' : ''} style={{ display: isLoading ? 'none' : 'block' }}>
            {isError ? (
              <p className="text-white mt-4">An error occurred while loading monsters.</p>
            ) : displayedMonsters.length > 0 ? (
              <>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 place-items-center gap-y-[1vh] gap-x-[10vw] lg:gap-x-[4vw] min-h-[75vh]">
                  {displayedMonsters.map((monster, idx) => (
                    <MonsterCard key={idx} {...monster.data!} onLoad={() => handleMonsterLoad(idx)} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  totalPages={totalPages}
                />
              </>
            ) : (
              <div className="flex h-[79.5vh] items-center justify-center">
                <p className="text-center text-xl">No monsters found.</p>
              </div>
            )}
          </section>

        </section>
      </main>
    </MainPageLayout>
  );
}