import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard';
import useMonster from '../../hooks/useMonster.ts';
import { hourglass } from 'ldrs';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar.tsx';
import MonsterFilter from '../../components/MonsterFilter/MonsterFilter.tsx';
import HitPointsFilter from '../../components/MonsterFilter/HpFilter.tsx';

const monstersPerPage = 8;

export default function MonsterPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());

  const [hpFilterMin, setHpFilterMin] = useState<number | null>(null);
  const [hpFilterMax, setHpFilterMax] = useState<number | null>(null);
  const [dynamicMinHp, setDynamicMinHp] = useState<number>(0);
  const [dynamicMaxHp, setDynamicMaxHp] = useState<number>(1000);

  hourglass.register();

  const { monsters, totalMonsters, minHp, maxHp, loading, error } = useMonster(
    debouncedSearchTerm,
    currentPage,
    monstersPerPage,
    selectedFilters,
    hpFilterMin !== null ? hpFilterMin : undefined,
    hpFilterMax !== null ? hpFilterMax : undefined
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setDynamicMinHp(minHp);
    setDynamicMaxHp(maxHp);

    // Initialize HP filter only when `selectedFilters` changes
    if (hpFilterMin === null && hpFilterMax === null) {
      setHpFilterMin(minHp);
      setHpFilterMax(maxHp);
    }
  }, [minHp, maxHp, selectedFilters, hpFilterMin, hpFilterMax]);

  const handleHpChange = useCallback(
    debounce((min: number, max: number) => {
      setHpFilterMin(min);
      setHpFilterMax(max);
      setCurrentPage(1);
    }, 300),
    []
  );

  const totalPages = Math.min(Math.ceil(totalMonsters / monstersPerPage), 10);

  const handlePageChange = useCallback(
    (direction: number) => {
      setCurrentPage((prev) => {
        if (direction === 1 && prev < totalPages) {
          return prev + direction;
        }
        if (direction === -1 && prev > 1) {
          return prev + direction;
        }
        return prev;
      });
    },
    [totalPages]
  );

  return (
    <MainPageLayout>
      <main className="main before:bg-monsters xl:h-screen xl:overflow-hidden">
        <div className="black-overlay" />

        <section className="wrapper py-10 w-[90%] mt-[5vh] gap-[3vh] !justify-start">
          <div className={'flex gap-10 z-10 items-center justify-center flex-col-reverse xl:flex-row'}>
            <HitPointsFilter minHp={dynamicMinHp} maxHp={dynamicMaxHp} onHpChange={handleHpChange} />
            <MonsterFilter selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
            <SearchBar
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              placeholder="Search for a monster..."
            />
          </div>

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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 place-items-center gap-y-[10vh] lg:gap-y-[1vh] gap-x-[10vw] lg:gap-x-[4vw] min-h-[75vh]">
                    {monsters.map((monster, idx) => (
                      <MonsterCard key={idx} {...monster} />
                    ))}
                  </div>
                  <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
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
