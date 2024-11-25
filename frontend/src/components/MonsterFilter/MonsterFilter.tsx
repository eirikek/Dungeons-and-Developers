import { useQuery } from '@apollo/client';
import { Box, Slider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.tsx';
import { GET_MONSTER_HP_RANGE } from '../../graphql/queries/monsterQueries.ts';
import { useToast } from '../../hooks/useToast.ts';

interface MonsterFilterProps {
  selectedFilters: Set<string>;
  setSelectedFilters: (filters: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  onHpChange: (min: number, max: number) => void;
  setCurrentPage: (page: number) => void;
  onClearFilters: () => void;
  monsterCounts: Record<string, number>;
  searchTerm: string;
}

const filterOptions = [
  'dragon',
  'aberration',
  'humanoid',
  'monstrosity',
  'beast',
  'plant',
  'construct',
  'fiend',
  'fey',
  'undead',
  'elemental',
];

export default function MonsterFilter({
  selectedFilters,
  setSelectedFilters,
  onHpChange,
  setCurrentPage,
  onClearFilters,
  monsterCounts,
  searchTerm,
}: MonsterFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: hpRangeData, loading: hpRangeLoading } = useQuery(GET_MONSTER_HP_RANGE);
  const initialHpRange = hpRangeData ? [hpRangeData.monsterHpRange.minHp, hpRangeData.monsterHpRange.maxHp] : [1, 546];
  const [hpRange, setHpRange] = useState<number[]>(initialHpRange);
  const [outOfRangeFilters, setOutOfRangeFilters] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

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
        className={`text px-1 rounded-md border-2 transition-colors duration-200 ${
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
        <div className="absolute left-1/2 transform -translate-x-1/2 bg-customGray shadow-xl shadow-black p-8 rounded mt-2 min-w-[30vw] w-max">
          <div className="flex justify-between items-center mb-4">
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
          <h2 className="text bold mb-2 ">Type:</h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-4">
            {filterOptions.map((option) => {
              const count = monsterCounts[option] || 0;
              const isDisabled = count === 0 && !selectedFilters.has(option);

              return (
                <label
                  key={option}
                  className={`flex items-center gap-5 mb-2 ${isDisabled ? 'text-gray-500' : ''} ${window.innerWidth < 1280 ? 'text' : ''}`}
                  style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                >
                  <CustomCheckbox
                    key={`${option}-${selectedFilters.has(option)}`}
                    checked={selectedFilters.has(option)}
                    onChange={() => handleCheckboxChange(option)}
                    scale={0.8}
                    disabled={isDisabled}
                  />
                  <span>
                    {option} {count > 0 && `(${count})`}
                  </span>
                </label>
              );
            })}
          </div>
          <Box>
            <h2 className="text bold">Hit Points:</h2>
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
              <span>min: {hpRange[0]}</span>
              <span>max: {hpRange[1]}</span>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
}
