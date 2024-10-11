import { Button } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { hourglass } from 'ldrs';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard';
import Navbar from '../../components/Navbar/Navbar';
import mockup, { Monster } from '../../data/mockup';
import useMonsters, { MonsterCardDataProps } from '../../hooks/useMonster';
import MonsterModal from '../../components/MonsterModal/MonsterModal.tsx';

const monsterIndexArray: string[] = mockup.results.map((result: Monster) => result.index);
const monstersPerPage = 6;

export default function MonsterPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState<string>('');

  // Used for loading screen
  hourglass.register();

  const monsterData = useMonsters(
    monsterIndexArray,
    debouncedSearchTerm,
    currentPage,
    monstersPerPage,
    false
  ) as UseQueryResult<MonsterCardDataProps, Error>[];

  const filteredMonsters = useMemo(
    () =>
      debouncedSearchTerm === ''
        ? monsterIndexArray
        : monsterIndexArray.filter((monsterIndex) =>
            monsterIndex.includes(debouncedSearchTerm.toLowerCase().replace(/\s+/g, '-'))
          ),
    [debouncedSearchTerm]
  );

  // Apply pagination to filtered results
  const totalFilteredMonsters = filteredMonsters.length;
  const totalPages = Math.ceil(totalFilteredMonsters / monstersPerPage);

  // https://medium.com/nerd-for-tech/debounce-your-search-react-input-optimization-fd270a8042b
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
  };

  const handleClose = () => {
    setModal('');
  };

  const handleModalClick = (monsterIndex: string | undefined) => {
    setModal(monsterIndex ?? '');
  };

  const handleMonsterLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  const allImagesLoaded = loadedImages.size === monsterData.length;

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setLoadedImages(new Set());
    } else if (currentPage == Math.ceil(monsterIndexArray.length / monstersPerPage)) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (currentPage === 1) {
      setCurrentPage(Math.ceil(monsterIndexArray.length / monstersPerPage));
    }

    setLoadedImages(new Set());
  };

  useEffect(() => {
    setCurrentPage(1);
    setLoadedImages(new Set());
  }, [debouncedSearchTerm]);

  const isLoading = monsterData.some((monster) => monster.isLoading) || !allImagesLoaded;
  const isError = monsterData.some((monster) => monster.isError);

  const displayedMonsters = monsterData.filter((monster) => monster.data && !monster.isLoading && !monster.isError);

  return (
    <div className="bg-madmage bg-center bg-cover bg-no-repeat min-h-screen flex flex-col items-center justify-center">
      <Navbar />
      <div className="mt-5"></div>
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full">
          <l-hourglass size="70" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>
        </div>
      )}
      <div
        className={`bg-customGray bg-opacity-80 p-8 rounded-lg shadow-lg w-2/3 tablet:w-10/12 h-auto flex flex-col items-center justify-center mt-10 mb-10 ${
          isLoading ? 'hidden' : ''
        }`}
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <h2 className="text-2xl text-white font-bold mt-10">Monsters</h2>
        <input
          type="text"
          placeholder="Search for a monster..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        />
        {isError ? (
          <p className="text-white mt-4">An error occurred while loading monsters.</p>
        ) : displayedMonsters.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-8 mt-8">
              {displayedMonsters.map((monster, idx) => (
                <MonsterCard
                  key={idx}
                  {...monster.data!}
                  onLoad={() => handleMonsterLoad(idx)}
                  onClickFunc={() => handleModalClick(monster.data?.index)}
                />
              ))}
            </div>

            <div className={'fixed top-28 left-[15%] z-10'}>
              {modal && <MonsterModal closeModal={handleClose} monsterName={modal} />}
            </div>

            {totalFilteredMonsters > monstersPerPage && (
              <div className="mt-4 flex items-center space-x-4">
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous Page
                </Button>
                <p className="text-white">
                  Page: {currentPage}/{totalPages}
                </p>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next Page
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-white mt-4">No monsters found.</p>
        )}
      </div>
    </div>
  );
}
