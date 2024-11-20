import { useQuery } from '@apollo/client';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard';
import useMonster from '../../hooks/useMonster.ts';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import LoadingHourglass from '../../components/LoadingHourglass/LoadingHourglass.tsx';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar.tsx';
import MonsterFilter from '../../components/MonsterFilter/MonsterFilter.tsx';
import MonsterSort from '../../components/MonsterSort/MonsterSort.tsx';
import useMonsterSuggestions from '../../hooks/useMonsterSuggestions';
import { GET_MONSTER_HP_RANGE } from '../../graphql/getMonsterQuerie.ts';

const monstersPerPage = 8;

export default function MonsterPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [suggestions, setSuggestions] = useState([]);
  const [hpFilterMin, setHpFilterMin] = useState<number>(1);
  const [hpFilterMax, setHpFilterMax] = useState<number>(1000);
  const [sortOption, setSortOption] = useState<string>('name-asc');

  const { data: hpRangeData, loading: hpRangeLoading } = useQuery(GET_MONSTER_HP_RANGE);

  useEffect(() => {
    if (hpRangeData && !hpRangeLoading) {
      setHpFilterMin(hpRangeData.monsterHpRange.minHp);
      setHpFilterMax(hpRangeData.monsterHpRange.maxHp);
    }
  }, [hpRangeData, hpRangeLoading]);

  const { monsters, totalMonsters, minHp, maxHp, monsterCounts, loading, error } = useMonster(
    debouncedSearchTerm,
    currentPage,
    monstersPerPage,
    selectedFilters,
    hpFilterMin,
    hpFilterMax,
    sortOption
  );

  const handleSortChange = (selectedSort: string) => {
    setSortOption(selectedSort);
  };

  const { suggestions: suggestionResults, loading: suggestionsLoading } = useMonsterSuggestions(
    debouncedSearchTerm,
    selectedFilters,
    hpFilterMin,
    hpFilterMax
  );

  useEffect(() => {
    if (suggestionResults && !suggestionsLoading) {
      const newSuggestions = suggestionResults.map((monster: { name: string }) => monster.name);
      if (JSON.stringify(suggestions) !== JSON.stringify(newSuggestions)) {
        setSuggestions(newSuggestions);
      }
    }
  }, [suggestionResults, suggestions, suggestionsLoading]);

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
    if (hpFilterMin === null && hpFilterMax === null && minHp && maxHp) {
      setHpFilterMin(minHp);
      setHpFilterMax(maxHp);
    }
  }, [minHp, maxHp, hpFilterMin, hpFilterMax]);

  const handleHpChange = useCallback((min: number, max: number) => {
    setHpFilterMin(min);
    setHpFilterMax(max);
    setCurrentPage(1);
  }, []);

  const debouncedHandleHpChange = useMemo(() => debounce(handleHpChange, 300), [handleHpChange]);

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

  const clearFilters = () => {
    setSearchTerm('');
    debouncedSearch('');
    setHpFilterMin(minHp);
    setHpFilterMax(maxHp);
  };

  return (
    <MainPageLayout>
      <main className="main before:bg-monsters xl:h-screen xl:overflow-hidden">
        <div className="black-overlay" />

        <section className="wrapper py-10 w-[90%] mt-[5vh] gap-[3vh] !justify-start">
          <div className={'flex gap-10 z-10 items-center justify-center flex-col-reverse xl:flex-row xl:min-h-[6vh]'}>
            <MonsterFilter
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              onHpChange={debouncedHandleHpChange}
              setCurrentPage={setCurrentPage}
              onClearFilters={clearFilters}
              monsterCounts={monsterCounts}
            />
            <MonsterSort selectedSort={sortOption} onSortChange={handleSortChange} />
            <SearchBar
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              suggestions={suggestions}
              onSuggestionClick={(suggestion) => {
                setSearchTerm(suggestion);
                debouncedSearch(suggestion);
              }}
              placeholder="Search for a monster..."
            />
          </div>

          {loading ? (
            <LoadingHourglass />
          ) : (
            <section>
              {error ? (
                <p>An error occurred while loading monsters. {error.message}</p>
              ) : monsters.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 place-items-center gap-y-[10vh] lg:gap-y-[1vh] gap-x-[10vw] lg:gap-x-[4vw] min-h-[75vh]">
                    {monsters.map((monster, idx) => (
                      <MonsterCard key={idx} {...monster} />
                    ))}
                  </div>
                  <div className="min-h-[5vh]">
                    {totalMonsters > monstersPerPage ? (
                      <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
                    ) : (
                      <div />
                    )}
                  </div>
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
