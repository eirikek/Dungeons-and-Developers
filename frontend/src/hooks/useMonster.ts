import { useQuery, gql } from '@apollo/client';
import { useMemo } from 'react';

// GraphQL query med søkeord og paginering
const GET_MONSTERS = gql`
    query GetMonsters($searchTerm: String, $offset: Int, $limit: Int) {
        monsters(searchTerm: $searchTerm, offset: $offset, limit: $limit) {
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

export interface Monster {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  hit_points: number;
  image?: string;
}

export interface MonsterCardDataProps {
  index: string;
  name: string;
  type: string;
  hp: number;
  alignment: string;
  size: string;
  img?: string;
}

function useMonster(searchTerm: string, currentPage: number, monstersPerPage: number) {
  const offset = (currentPage - 1) * monstersPerPage;

  // Utfør queryen med Apollo Client og send inn nødvendige variabler
  const { data, error, loading } = useQuery<{ monsters: Monster[] }>(GET_MONSTERS, {
    variables: { searchTerm, offset, limit: monstersPerPage },
    fetchPolicy: 'network-only',  // Hent alltid ferske data fra serveren
  });

  console.log('Data from server: ', data); // For å se hva som returneres fra serveren

  const transformedMonsters = useMemo(() => {
    if (!data || !data.monsters) return [];
    return data.monsters.map(monster => ({
      index: monster.index,
      name: monster.name,
      type: monster.type,
      hp: monster.hit_points,
      alignment: monster.alignment,
      size: monster.size,
      img: monster.image,
    }));
  }, [data]);

  return {
    monsters: transformedMonsters,
    loading,
    error,
  };
}

export default useMonster;