import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_MONSTER_TYPE_COUNTS, GET_MONSTERS } from '../graphql/queries/monsterQueries.ts';
import MonsterDataProps from '../interfaces/MonsterDataProps.ts';

/**
 * Custom Hook: `useMonster`
 *
 * Fetches and manages data for a list of monsters based on various filters and criteria.
 *
 * Features:
 * - Queries monsters based on search term, filters, hit point range, and sorting options.
 * - Retrieves counts for different monster types.
 * - Filters and transforms monster data for convenient use in the UI.
 *
 * Dependencies:
 * - `GET_MONSTERS`: GraphQL query to fetch monsters with optional filters and sorting.
 * - `GET_MONSTER_TYPE_COUNTS`: GraphQL query to fetch monster type counts based on HP range.
 *
 * @param searchTerm The search term used to filter monsters by name or attributes.
 * @param currentPage The current page number for pagination.
 * @param monstersPerPage The number of monsters to display per page.
 * @param selectedFilters A set of selected monster type filters.
 * @param minHp (Optional) Minimum hit points to filter monsters.
 * @param maxHp (Optional) Maximum hit points to filter monsters.
 * @param sortOption (Default: `'name-asc'`) The sorting option for the monster list.
 *
 * @returns An object containing:
 * - `monsters`: An array of transformed monster data.
 * - `totalMonsters`: The total number of monsters matching the query.
 * - `minHp`: The minimum HP value from the query result (default is 1).
 * - `maxHp`: The maximum HP value from the query result (default is 1000).
 * - `monsterCounts`: An object mapping monster types to their respective counts.
 * - `monsterTypes`: An array of available monster types.
 * - `loading`: A boolean indicating if the data is currently being fetched.
 * - `error`: Any error encountered during the query execution.
 *
 * @example
 * ```tsx
 * const {
 *   monsters,
 *   totalMonsters,
 *   minHp,
 *   maxHp,
 *   monsterCounts,
 *   monsterTypes,
 *   loading,
 *   error,
 * } = useMonster('dragon', 1, 10, new Set(['fire']), 50, 500, 'difficulty-desc');
 *
 * if (loading) return <p>Loading...</p>;
 * if (error) return <p>Error loading monsters</p>;
 *
 * return (
 *   <div>
 *     <h1>Total Monsters: {totalMonsters}</h1>
 *     <ul>
 *       {monsters.map((monster) => (
 *         <li key={monster.id}>{monster.name} - {monster.type}</li>
 *       ))}
 *     </ul>
 *   </div>
 * );
 * ```
 */

function useMonster(
  searchTerm: string,
  currentPage: number,
  monstersPerPage: number,
  selectedFilters: Set<string>,
  minHp?: number | null,
  maxHp?: number | null,
  sortOption: string = 'name-asc'
) {
  const offset = (currentPage - 1) * monstersPerPage;

  const queryVariables = {
    searchTerm,
    offset,
    limit: monstersPerPage,
    types: Array.from(selectedFilters),
    sortOption,
    ...(minHp !== undefined && maxHp !== undefined ? { minHp, maxHp } : {}),
  };

  const { data, error, loading } = useQuery<{
    monsters: { monsters: MonsterDataProps[]; totalMonsters: number; minHp: number; maxHp: number };
  }>(GET_MONSTERS, {
    variables: queryVariables,
    fetchPolicy: 'cache-first',
  });

  const { data: typeCountsData } = useQuery(GET_MONSTER_TYPE_COUNTS, {
    variables: { minHp, maxHp },
    fetchPolicy: 'cache-first',
  });

  const monsterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    typeCountsData?.monsterTypeCounts.forEach((entry: { type: string; count: number }) => {
      counts[entry.type] = entry.count;
    });
    return counts;
  }, [typeCountsData]);

  const monsterTypes = useMemo(() => {
    return Object.keys(monsterCounts);
  }, [monsterCounts]);

  const transformedMonsters = useMemo(() => {
    if (!data || !data.monsters) return [];
    const filteredMonsters = data.monsters.monsters.filter(
      (monster) => selectedFilters.size === 0 || selectedFilters.has(monster.type)
    );

    return filteredMonsters.map((monster) => ({
      id: monster.id,
      name: monster.name,
      type: monster.type,
      hit_points: monster.hit_points,
      alignment: monster.alignment,
      size: monster.size,
      image: monster.image,
    }));
  }, [data, selectedFilters]);

  return {
    monsters: transformedMonsters,
    totalMonsters: data?.monsters.totalMonsters || 0,
    minHp: data?.monsters.minHp || 1,
    maxHp: data?.monsters.maxHp || 1000,
    monsterCounts,
    monsterTypes,
    loading,
    error,
  };
}

export default useMonster;
