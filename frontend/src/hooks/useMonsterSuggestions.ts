import { useQuery } from '@apollo/client';
import { GET_MONSTER_SUGGESTIONS } from '../graphql/queries.ts';

function useMonsterSuggestions(searchTerm: string, selectedFilters: Set<string>, minHp?: number, maxHp?: number) {
  const { data, loading, error } = useQuery(GET_MONSTER_SUGGESTIONS, {
    variables: {
      searchTerm,
      types: Array.from(selectedFilters),
      minHp,
      maxHp,
    },
    skip: !searchTerm,
  });

  return {
    suggestions: data?.monsters.monsters || [],
    loading,
    error,
  };
}

export default useMonsterSuggestions;
