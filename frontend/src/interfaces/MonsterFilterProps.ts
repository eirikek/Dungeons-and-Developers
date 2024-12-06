export default interface MonsterFilterProps {
  selectedFilters: Set<string>;
  setSelectedFilters: (filters: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  onHpChange: (min: number, max: number) => void;
  setCurrentPage: (page: number) => void;
  onClearFilters: () => void;
  monsterCounts: Record<string, number>;
  monsterTypes: string[];
  searchTerm: string;
}
