import { useQuery } from '@apollo/client';
import { Box, Slider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { GET_MONSTER_HP_RANGE } from '../../graphql/queries/monsterQueries.ts';
import { useToast } from '../../hooks/useToast.ts';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';

interface MonsterFilterProps {
  selectedFilters: Set<string>;
  setSelectedFilters: (filters: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  onHpChange: (min: number, max: number) => void;
  setCurrentPage: (page: number) => void;
  onClearFilters: () => void;
  monsterCounts: Record<string, number>;
  monsterTypes: string[];
  searchTerm: string;
}

export default function MonsterFilter({
  selectedFilters,
  setSelectedFilters,
  onHpChange,
  setCurrentPage,
  onClearFilters,
  monsterCounts,
  monsterTypes,
  searchTerm,
}: MonsterFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: hpRangeData, loading: hpRangeLoading } = useQuery(GET_MONSTER_HP_RANGE);
  const initialHpRange = hpRangeData ? [hpRangeData.monsterHpRange.minHp, hpRangeData.monsterHpRange.maxHp] : [1, 546];
  const [hpRange, setHpRange] = useState<number[]>(initialHpRange);
  const [outOfRangeFilters, setOutOfRangeFilters] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toastContext = useToast();
  const showToast = toastContext ? toastContext.showToast : () => {};

  useEffect(() => {
    if (hpRangeData && !hpRangeLoading) {
      setHpRange([hpRangeData.monsterHpRange.minHp, hpRangeData.monsterHpRange.maxHp]);
    }
  }, [hpRangeData, hpRangeLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    setOutOfRangeFilters((prevOutOfRange) => {
      const updatedOutOfRange = new Set(prevOutOfRange);
      let modified = false;

      selectedFilters.forEach((filter) => {
        if (monsterCounts[filter] === 0) {
          updatedOutOfRange.add(filter);
          modified = true;
        } else if (updatedOutOfRange.has(filter)) {
          updatedOutOfRange.delete(filter);
          modified = true;
        }
      });

      return modified ? updatedOutOfRange : prevOutOfRange;
    });
  }, [monsterCounts, selectedFilters]);

  const handleCheckboxChange = (option: string) => {
    setSelectedFilters((prev: Set<string>) => {
      const newFilters = new Set<string>(prev);
      const outOfRange = new Set(outOfRangeFilters);

      if (newFilters.has(option)) {
        newFilters.delete(option);
        outOfRange.delete(option);
      } else {
        newFilters.add(option);
        if (monsterCounts[option] === 0) {
          outOfRange.add(option);
        }
      }

      setOutOfRangeFilters(outOfRange);
      return newFilters;
    });
    setCurrentPage(1);
  };

  const toggleDropdown = () => {
    if (searchTerm) {
      showToast({
        message: 'Please clear the search bar before using the filters.',
        type: 'warning',
        duration: 4000,
      });
    } else {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setHpRange([min, max]);
    onHpChange(min, max);
  };

  const handleClearFilters = () => {
    if (selectedFilters.size > 0 || hpRange[0] !== initialHpRange[0] || hpRange[1] !== initialHpRange[1]) {
      setSelectedFilters(new Set<string>());
      setHpRange(initialHpRange);
      onHpChange(initialHpRange[0], initialHpRange[1]);
      setOutOfRangeFilters(new Set());
      onClearFilters();
    }
  };

  return (
    <div className="relative text-white" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`text px-1 rounded-md border-2 transition-colors duration-200  ${
          searchTerm
            ? 'bg-customGray text-gray-500 border-gray-500 cursor-not-allowed' // Disabled styling when searchTerm is active
            : 'bg-customRed hover:bg-transparent border-customRed hover:border-customRed hover:text-customRed'
        }`}
        style={{ pointerEvents: searchTerm ? 'auto' : 'initial' }} // Allows click for toast when disabled
      >
        Filter Monsters
        <FaChevronDown className="inline ml-3" />
      </button>
      {isDropdownOpen && (
        <div
          className="absolute bg-customGray shadow-xl shadow-black p-8 rounded mt-2 min-w-[30vw] w-max z-50
        max-xs:min-w-[90vw] max-xs:p-4
        xs:min-w-[80vw] sm:min-w-[60vw] md:min-w-[50vw] lg:min-w-[40vw] xl:min-w-[30vw]
        xl:top-1/2 xl:left-2 xl:transform xl:-translate-x-2 xl:-translate-y-2
        left-1/2 transform -translate-x-1/2 space-y-6"
          style={{ maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div className="flex gap-3 items-center">
            <button
              onClick={handleClearFilters}
              className="underline transition-all hover:text-customRed text outline-none"
            >
              Clear Filters
            </button>
            <FiX
              className="h-8 w-8 text-white hover:text-customRed cursor-pointer"
              onClick={toggleDropdown}
              aria-label="Close"
            />
          </div>
          <h2 className="text bold mb-2 xs:text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl">Type:</h2>
          <div className="grid grid-cols-2 gap-x-8 sm:gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {monsterTypes.map((option) => {
              const count = monsterCounts[option] || 0;
              const isDisabled = count === 0 && !selectedFilters.has(option);

              return (
                <label
                  key={option}
                  className={`flex items-center gap-x-6 ${isDisabled ? 'text-gray-500' : ''}
  xs:text-lg sm:text-lg md:text-xl lg:text-2xl`}
                  style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                >
                  <CustomCheckbox
                    key={`${option}-${selectedFilters.has(option)}`}
                    checked={selectedFilters.has(option)}
                    onChange={() => handleCheckboxChange(option)}
                    scale={0.8}
                    disabled={isDisabled}
                  />
                  <span className="xs:text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl">
                    {option} {count > 0 && `(${count})`}
                  </span>
                </label>
              );
            })}
          </div>
          <Box>
            <h2 className="text bold xs:text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl">Hit Points:</h2>
            <Slider
              value={hpRange}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={initialHpRange[0]}
              max={initialHpRange[1]}
              sx={{
                '& .MuiSlider-thumb': { color: '#DB3232', width: 24, height: 24 },
                '& .MuiSlider-track': { color: '#DB3232', height: 10 },
                '& .MuiSlider-rail': { color: '#DB3232', height: 10 },
              }}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <span className="xs:text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl">min: {hpRange[0]}</span>
              <span className="xs:text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl">max: {hpRange[1]}</span>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
}
