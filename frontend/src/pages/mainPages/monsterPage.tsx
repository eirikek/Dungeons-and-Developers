import { useQuery } from '@apollo/client';
import { hourglass } from 'ldrs';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import MonsterFilter from '../../components/MonsterFilter/MonsterFilter.tsx';
import MonsterSort from '../../components/MonsterSort/MonsterSort.tsx';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar.tsx';

import { IconButton } from '@mui/material';
import { MdCancel } from 'react-icons/md';
import MonsterGrid from '../../components/Dungeon/MonsterGrid.tsx';
import { GET_MONSTER_HP_RANGE } from '../../graphql/queries/monsterQueries.ts';
import useMonster from '../../hooks/useMonster.ts';
import useMonsterSuggestions from '../../hooks/useMonsterSuggestions';

const monstersPerPage = 8;

/**
 * MonsterPage Component
 *
 * A comprehensive monster browsing interface that provides advanced filtering,
 * searching, and sorting capabilities.
 *
 * Features:
 * - Monster filtering by HP range and custom selections
 * - Debounced search with auto-suggestions
 * - Customizable sorting (name, HP, etc.)
 * - Paginated results (8 monsters per page)
 * - Persistent state using sessionStorage
 *
 * State Management:
 * - searchTerm: Current search input
 * - selectedFilters: Set of active filter options
 * - hpFilterMin/Max: HP range filter values
 * - sortOption: Current sort preference
 * - currentPage: Active page number
 *
 * Performance Optimizations:
 * - Debounced search (300ms delay)
 * - Memoized handlers
 * - Lazy loading with loading states
 *
 * Error Handling:
 * - Displays error messages for failed data fetches
 * - Graceful fallback for no results
 *
 * Persistence:
 * All filter states and search preferences are preserved in sessionStorage:
 * - searchTerm
 * - selectedFilters
 * - hpFilterMin/Max
 * - sortOption
 * - currentPage
 *
 * @returns Rendered monsterpage
 */

export default function MonsterPage() {
  const [searchTerm, setSearchTerm] = useState<string>(() => sessionStorage.getItem('searchTerm') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(() => Number(sessionStorage.getItem('currentPage')) || 1);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(() => {
    const savedFilters = sessionStorage.getItem('selectedFilters');
    return savedFilters ? new Set(JSON.parse(savedFilters)) : new Set();
  });
  const [suggestions, setSuggestions] = useState([]);
  const [hpFilterMin, setHpFilterMin] = useState<number>(() => Number(sessionStorage.getItem('hpFilterMin')) || 1);
  const [hpFilterMax, setHpFilterMax] = useState<number>(() => Number(sessionStorage.getItem('hpFilterMax')) || 1000);
  const [sortOption, setSortOption] = useState<string>(() => sessionStorage.getItem('sortOption') || 'name-asc');

  useEffect(() => {
    sessionStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    sessionStorage.setItem('selectedFilters', JSON.stringify(Array.from(selectedFilters)));
  }, [selectedFilters]);

  useEffect(() => {
    sessionStorage.setItem('hpFilterMin', hpFilterMin.toString());
    sessionStorage.setItem('hpFilterMax', hpFilterMax.toString());
  }, [hpFilterMin, hpFilterMax]);

  useEffect(() => {
    sessionStorage.setItem('sortOption', sortOption);
  }, [sortOption]);

  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('searchTerm');
      sessionStorage.removeItem('selectedFilters');
      sessionStorage.removeItem('hpFilterMin');
      sessionStorage.removeItem('hpFilterMax');
      sessionStorage.removeItem('sortOption');
      sessionStorage.removeItem('currentPage');
    };
  }, []);

  hourglass.register();

  const { data: hpRangeData, loading: hpRangeLoading } = useQuery(GET_MONSTER_HP_RANGE);

  useEffect(() => {
    if (hpRangeData && !hpRangeLoading) {
      setHpFilterMin(hpRangeData.monsterHpRange.minHp);
      setHpFilterMax(hpRangeData.monsterHpRange.maxHp);
    }
  }, [hpRangeData, hpRangeLoading]);

  const { monsters, totalMonsters, minHp, maxHp, monsterCounts, monsterTypes, loading, error } = useMonster(
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

    if (value) {
      setSelectedFilters(new Set<string>());
    }
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

  const totalPages = loading ? 1 : Math.min(Math.ceil(totalMonsters / monstersPerPage), 42);

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

    sessionStorage.removeItem('searchTerm');
    sessionStorage.removeItem('selectedFilters');
    sessionStorage.removeItem('hpFilterMin');
    sessionStorage.removeItem('hpFilterMax');
    sessionStorage.removeItem('sortOption');
    sessionStorage.removeItem('currentPage');
  };

  return (
    <MainPageLayout>
      <main className="main xl:before:bg-monsters xl:h-screen xl:overflow-hidden">
        <div className="black-overlay opacity-40" />

        <section className="wrapper py-10 w-[90%] mt-[5vh] !justify-start">
          <div className={'flex gap-10 z-10 items-center justify-center flex-col-reverse xl:flex-row'}>
            <MonsterFilter
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              onHpChange={debouncedHandleHpChange}
              onClearFilters={clearFilters}
              monsterTypes={monsterTypes}
              monsterCounts={monsterCounts}
              setCurrentPage={setCurrentPage}
              searchTerm={searchTerm}
            />
            <MonsterSort selectedSort={sortOption} onSortChange={handleSortChange} />
            <div className="relative flex items-center">
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
              {searchTerm && (
                <IconButton
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedSearchTerm('');
                    setCurrentPage(1);
                  }}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    color: '#DB3232',
                    borderColor: '#DB3232',
                  }}
                  aria-label="Clear search"
                >
                  <MdCancel size={24} />
                </IconButton>
              )}
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[79.5vh]" data-testid="loading-indicator">
              <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
            </div>
          ) : (
            <section className="flex flex-col items-center w-full xl:h-screen justify-between pb-20">
              {error ? (
                <p>An error occurred while loading monsters. {error.message}</p>
              ) : monsters.length > 0 ? (
                <>
                  <MonsterGrid monsters={monsters} isDungeonPage={false} />
                  {totalMonsters > monstersPerPage && (
                    <div className="mt-6 w-full flex justify-center relative xl:sticky bottom-0">
                      <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
                    </div>
                  )}
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
