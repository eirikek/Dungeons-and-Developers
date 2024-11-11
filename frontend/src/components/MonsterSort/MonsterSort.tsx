import { useRef, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

interface SortDropdownProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { label: 'A-Z', value: 'name-asc' },
  { label: 'Z-A', value: 'name-desc' },
  { label: 'Difficulty: High-Low', value: 'difficulty-desc' },
  { label: 'Difficulty: Low-High', value: 'difficulty-asc' },
  { label: 'Most Reviewed', value: 'reviews-desc' },
];

export default function SortDropdown({ selectedSort, onSortChange }: SortDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSortChange = (value: string) => {
    onSortChange(value);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <label className="mr-4 whitespace-nowrap text">Sort By:</label>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="px-1 rounded-lg border-2 bg-customRed text hover:bg-transparent border-customRed hover:text-customRed transition-colors duration-200 flex items-center justify-between min-w-60"
        >
          {sortOptions.find((option) => option.value === selectedSort)?.label || 'Select'}
          <FaChevronDown className="ml-3" />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 bg-customGray shadow-xl shadow-black rounded-lg z-10 w-full">
            <div className="flex justify-end p-2">
              <FiX
                className="h-8 w-8 text-white hover:text-customRed cursor-pointer"
                onClick={() => setIsDropdownOpen(false)}
              />
            </div>
            <ul>
              {sortOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-4 py-2 rounded cursor-pointer hover:bg-customRed ${
                    selectedSort === option.value ? 'font-semibold' : ''
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
