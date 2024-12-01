import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import RaceProps from '../interfaces/RaceProps.ts';
import { GET_RACES } from '../graphql/queries/raceQueries.ts';
import { handleError } from '../utils/handleError.ts';

function useRaces(currentPage: number, racesPerPage: number, shouldFetch: boolean) {
  const offset = (currentPage - 1) * racesPerPage;

  const { data, error, loading } = useQuery<{
    races: { races: RaceProps[]; totalRaces: number };
  }>(GET_RACES, {
    variables: { offset, limit: racesPerPage },
    skip: !shouldFetch,
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      if (err) {
        handleError(err, 'Error fetching races', 'critical');
      }
    },
  });

  const transformedRaces = useMemo(() => {
    if (loading) {
      return [];
    }

    if (error) {
      handleError(error, 'Error fetching races', 'critical');
      return [];
    }

    if (!data || !data.races) {
      if (!shouldFetch) return [];
      handleError(null, 'No data received for races after loading', 'warning');
      return [];
    }
    return data.races.races.map((race) => ({
      id: race.id,
      index: race.index,
      name: race.name,
      speed: race.speed,
      alignment: race.alignment,
      size: race.size,
    }));
  }, [data, error, loading, shouldFetch]);

  return {
    races: transformedRaces,
    totalRaces: data?.races.totalRaces || 0,
    loading,
    error,
  };
}

export default useRaces;
