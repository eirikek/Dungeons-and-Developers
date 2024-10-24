import debounce from 'lodash/debounce';
import { useCallback, useMemo, useState } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard';
import useMonster from '../../hooks/useMonster.ts';
import { hourglass } from 'ldrs';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar.tsx';

const monstersPerPage = 8;

export default function MonsterPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Used for loading screen
  hourglass.register();

  // Får ut `monsters`, `loading`, og `error` fra hooken.
  const { monsters, totalMonsters, loading, error } = useMonster(
    debouncedSearchTerm,
    currentPage,
    monstersPerPage,
  );

  // Debounce søketerm oppdateringer
  const debouncedSearch = useMemo(() => debounce((value: string) => {
    setDebouncedSearchTerm(value);
  }, 300), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleMonsterLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  const totalPages = Math.min(Math.ceil(totalMonsters / monstersPerPage), 12);

  const handlePageChange = useCallback((direction: number) => {
    setCurrentPage((prev) => {
      if (direction === 1 && prev < totalPages) {
        return prev + direction;
      }
      if (direction === -1 && prev > 1) {
        return prev + direction;
      }
      return prev;
    });
  }, [totalPages]);

  return (
    <MainPageLayout>
      <main className="main before:bg-monsters xl:h-screen xl:overflow-hidden">
        <div className="black-overlay" />

        <section className="wrapper py-10 w-[90%] mt-[5vh] gap-[3vh] !justify-start">
          <SearchBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            placeholder="Search for a monster..."
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[79.5vh]">
              <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
            </div>
          ) : (
            <section>
              {error ? (
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