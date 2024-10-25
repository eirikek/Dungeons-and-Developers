import { useQuery, gql } from '@apollo/client';
import { useMemo } from 'react';

export interface Race {
  index: string;
  name: string;
  speed: string;
  alignment: string;
  size: number;
  size_description: string;
  img?: string;
}

const GET_RACES = gql`
    query GetRaces($offset: Int, $limit: Int) {
        races(offset: $offset, limit: $limit) {
            races {
                index
                name
                speed
                alignment
                size
                size_description
                img
            }
            totalRaces
        }
    }
`;

function useRace(currentPage: number, racesPerPage: number) {
  const offset = (currentPage - 1) * racesPerPage;

  const { data, error, loading } = useQuery<{
    races: { races: Race[], totalRaces: number }
  }>(GET_RACES, {
    variables: { offset, limit: racesPerPage },
    fetchPolicy: 'network-only',
  });

  console.log('Data from server: ', data);

  const transformedRaces = useMemo(() => {
    if (!data || !data.races) return [];
    return data.races.races.map(race => ({
      index: race.index,
      name: race.name,
      speed: race.speed,
      alignment: race.alignment,
      size: race.size,
      size_description: race.size_description,
      img: race.img,
    }));
  }, [data]);

  return {
    races: transformedRaces,
    totalRaces: data?.races.totalRaces || 0,
    loading,
    error,
  };
}

export default useRace;