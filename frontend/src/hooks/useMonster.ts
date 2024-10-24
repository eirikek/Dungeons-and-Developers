import { useQuery, gql } from '@apollo/client';
import { useMemo } from 'react';

/**
 * GraphQL query for getting all monsters from the database
 */
const GET_MONSTERS = gql`
    query GetMonsters {
        monsters {
            index
            name
            size
            type
            alignment
            hit_points
            image
        }
    }
`;

/**
 * Interface representing the structure of a Monster object.
 */
export interface Monster {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  hit_points: number;
  image?: string;
}

/**
 * Interface representing the structure of MonsterCardDataProps.
 */
export interface MonsterCardDataProps {
  index: string;
  name: string;
  type: string;
  hp: number;
  alignment: string;
  size: string;
  img?: string;
}

/**
 * Custom hook to fetch and filter multiple monsters' data using Apollo Client and React.
 * @param {string} searchTerm - The search term to filter monsters.
 * @param {number} currentPage - The current page number.
 * @param {number} monstersPerPage - The number of monsters to display per page.
 * @returns An object containing the filtered and paginated monsters.
 */
function useMonster(
  searchTerm: string,
  currentPage: number,
  monstersPerPage: number,
) {
  const { data, error, loading } = useQuery<{ monsters: Monster[] }>(GET_MONSTERS);

  // Map the Monster object to MonsterCardDataProps
  const transformedMonsters = useMemo(() => {
    if (!data) return [];
    return data.monsters.map(monster => ({
      index: monster.index,
      name: monster.name,
      type: monster.type,
      hp: monster.hit_points, // map hit_points to hp
      alignment: monster.alignment,
      size: monster.size,
      img: monster.image, // map image to img
    }));
  }, [data]);

  // Filter monsters based on the search term
  const filteredMonsters = useMemo(() => {
    if (!transformedMonsters) return [];
    return searchTerm === ''
      ? transformedMonsters
      : transformedMonsters.filter((monster) =>
        monster.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  }, [transformedMonsters, searchTerm]);

  // Paginate the filtered monsters
  const paginatedMonsters = useMemo(() => {
    return filteredMonsters.slice(
      (currentPage - 1) * monstersPerPage,
      currentPage * monstersPerPage,
    );
  }, [filteredMonsters, currentPage, monstersPerPage]);

  return {
    monsters: paginatedMonsters,
    loading,
    error,
  };
}

export default useMonster;