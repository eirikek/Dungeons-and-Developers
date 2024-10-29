import { useState } from 'react';

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
  'giant',
  'undead',
  'celestial',
  'elemental',
];

export default function MonsterFilter() {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCheckboxChange = (option: string) => {
    setSelectedFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(option)) {
        newFilters.delete(option);
      } else {
        newFilters.add(option);
      }
      return newFilters;
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative text-white">
      <button onClick={toggleDropdown} className="bg-gray-800 p-2 rounded">
        Filter Monsters
      </button>
      {isDropdownOpen && (
        <div className="absolute bg-gray-700 p-4 rounded mt-2 w-48">
          {filterOptions.map((option) => (
            <label key={option} className="block">
              <input
                type="checkbox"
                checked={selectedFilters.has(option)}
                onChange={() => handleCheckboxChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
