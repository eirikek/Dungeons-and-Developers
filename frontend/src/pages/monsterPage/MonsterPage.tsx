import { Button } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { hourglass } from 'ldrs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MonsterCard from '../../components/MonsterCard/MonsterCard';
import Navbar from '../../components/Navbar/Navbar';
import mockup, { Monster } from '../../data/mockup';
import useMonsters from '../../hooks/useMonster';
import { MonsterCardDataProps } from '../../hooks/useMonster.ts';

const monsterIndexArray: string[] = mockup.results.map((result: Monster) => result.index);
const monstersPerPage = 6;

export default function MonsterPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  /*
  The code for tracking loaded images was generated with assistance from an AI model (ChatGPT)
  during a discussion on best practices for React state management and image loading,
  on October 10, 2024.
  Prompt: Problem now is that monstercards are displayed before all images of them are loaded. So hourglass is removed too early
  */
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  hourglass.register();

  const filteredMonsters = useMemo(
    () =>
      monsterIndexArray.filter((monsterIndex) => monsterIndex.includes(searchTerm.toLowerCase().replace(/\s+/g, '-'))),
    [searchTerm]
  );

  const totalFilteredMonsters = filteredMonsters.length;
  const totalPages = Math.ceil(totalFilteredMonsters / monstersPerPage);

  const displayedMonsters = useMemo(
    () =>
      filteredMonsters.slice(
        (currentPage - 1) * monstersPerPage,
        (currentPage - 1) * monstersPerPage + monstersPerPage
      ),
    [filteredMonsters, currentPage]
  );

  const monsterData = useMonsters(displayedMonsters, false) as UseQueryResult<MonsterCardDataProps, Error>[];

  const handleMonsterLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  const allImagesLoaded = loadedImages.size === monsterData.length;

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setLoadedImages(new Set());
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setLoadedImages(new Set());
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setLoadedImages(new Set());
  }, [searchTerm]);

  const isLoading = monsterData.some((monster) => monster.isLoading) || !allImagesLoaded;

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
          {monsterData.map((monster, idx) =>
            monster.data && !monster.isLoading && !monster.isError ? (
              <MonsterCard key={idx} {...monster.data} onLoad={() => handleMonsterLoad(idx)} />
            ) : null
          )}
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
