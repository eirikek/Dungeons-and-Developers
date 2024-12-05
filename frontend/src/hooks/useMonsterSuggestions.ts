import { useQuery } from '@apollo/client';
import { GET_MONSTER_SUGGESTIONS } from '../graphql/queries/monsterQueries.ts';

/**
 * Custom Hook: `useMonsterSuggestions`
 *
 * Provides monster suggestions based on a search term and optional filters.
 *
 * Features:
 * - Queries a list of monsters matching the search term.
 * - Applies filters for monster types and hit point range.
 * - Optimized to skip execution when no search term is provided.
 *
 * Dependencies:
 * - `GET_MONSTER_SUGGESTIONS`: GraphQL query to fetch monster suggestions based on search and filters.
 *
 * @param searchTerm The search term used to find monsters by name or attributes.
 * @param selectedFilters A set of selected monster type filters.
 * @param minHp (Optional) Minimum hit points to filter monsters.
 * @param maxHp (Optional) Maximum hit points to filter monsters.
 *
 * @returns An object containing:
 * - `suggestions`: An array of suggested monsters matching the query.
 * - `loading`: A boolean indicating if the suggestions are being fetched.
 * - `error`: Any error encountered during the query execution.
 *
 * @example
 * ```tsx
 * const { suggestions, loading, error } = useMonsterSuggestions('dragon', new Set(['fire']), 50, 500);
 *
 * if (loading) return <p>Loading...</p>;
 * if (error) return <p>Error fetching suggestions</p>;
 *
 * return (
 *   <ul>
 *     {suggestions.map((monster) => (
 *       <li key={monster.id}>{monster.name}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */

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
