import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard';
import mockup, { Monster } from '../../data/mockup';
import useMonster, { MonsterCardDataProps } from '../../hooks/useMonster.ts';
import { hourglass } from 'ldrs';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar.tsx';

const monsterIndexArray: string[] = mockup.results.map((result: Monster) => result.index);
const monstersPerPage = 8;

export default function MonsterPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Used for loading screen
  hourglass.register();

  const { monsters, loading, error } = useMonster(
    debouncedSearchTerm,
    currentPage,
    monstersPerPage,
  );

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

  const isLoading = loading;
  const isError = error !== undefined;

  return (
    <MainPageLayout>
      <main
        className="main before:bg-monsters xl:h-screen xl:overflow-hidden">
        <div className="black-overlay" />

        <section
          className="wrapper py-10 w-[90%] mt-[5vh] gap-[3vh] !justify-start"
        >
          <SearchBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            placeholder="Search for a monster..."
          />

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-[79.5vh]">
              <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
            </div>
          )}

          {!isLoading && (
            <section>
              {isError ? (
                <p>An error occurred while loading monsters.</p>
              ) : monsters.length > 0 ? (
                <>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 place-items-center gap-y-[10vh] lg:gap-y-[1vh] gap-x-[10vw] lg:gap-x-[4vw] min-h-[75vh]">
                    {monsters.map((monster, idx) => (
                      <MonsterCard key={idx} {...monster} onLoad={() => handleMonsterLoad(idx)} />
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
                  <h2 className="text-center sub-header">No monsters found</h2>
                </div>
              )}
            </section>
          )}
        </section>
      </main>
    </MainPageLayout>
  );
}