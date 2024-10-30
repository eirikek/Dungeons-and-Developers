import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import MonsterDataProps from '../interfaces/MonsterDataProps.ts';

const GET_MONSTERS = gql`
  query GetMonsters($searchTerm: String, $offset: Int, $limit: Int, $types: [String!]) {
    monsters(searchTerm: $searchTerm, offset: $offset, limit: $limit, types: $types) {
      monsters {
        id
        name
        size
        type
        alignment
        hit_points
        image
      }
      totalMonsters
    }
  }
`;

function useMonster(searchTerm: string, currentPage: number, monstersPerPage: number, selectedFilters) {
  const offset = (currentPage - 1) * monstersPerPage;

  const { data, loading, error } = useQuery<{
    monsters: { monsters: MonsterDataProps[]; totalMonsters: number };
  }>(GET_MONSTERS, {
    variables: { searchTerm, offset, limit: monstersPerPage, types: Array.from(selectedFilters) },
    fetchPolicy: 'network-only',
  });

  const transformedMonsters = useMemo(() => {
    if (!data || !data.monsters) return [];

    // Access `data.monsters.monsters` instead of `data.monsters`
    const filteredMonsters = data.monsters.monsters.filter(
      (monster) => selectedFilters.size === 0 || selectedFilters.has(monster.type)
    );

    return filteredMonsters.map((monster) => ({
      id: monster.id,
      name: monster.name,
      type: monster.type,
      hp: monster.hit_points,
      alignment: monster.alignment,
      size: monster.size,
      img: monster.image,
    }));
  }, [data, selectedFilters]);

  return {
    monsters: transformedMonsters,
    totalMonsters: data?.monsters.totalMonsters || 0, // Update this to use `data.monsters.totalMonsters`
    loading,
    error,
  };
}

export default useMonster;
