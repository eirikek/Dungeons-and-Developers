import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import RaceProps from '../interfaces/RaceProps.ts';
import { GET_RACES } from '../graphql/queries/raceQueries.ts';
import { handleError } from '../utils/handleError.ts';

/**
 * Custom Hook: `useRaces`
 *
 * Fetches and transforms race data from the GraphQL API, supporting pagination and conditional fetching.
 *
 * Features:
 * - Executes a query to fetch race data based on the current page and number of races per page.
 * - Handles GraphQL query errors with custom error handling.
 * - Transforms the fetched race data into a usable format.
 *
 * Dependencies:
 * - `GET_RACES`: GraphQL query to fetch races and their metadata.
 * - `handleError`: Utility function to log and handle errors gracefully.
 *
 * @param currentPage The current page for race pagination.
 * @param racesPerPage The number of races to fetch per page.
 * @param shouldFetch A boolean to determine whether the query should execute.
 *
 * @returns An object containing:
 * - `races`: An array of transformed race data.
 * - `totalRaces`: The total number of races available in the dataset.
 * - `loading`: A boolean indicating if the races are being fetched.
 * - `error`: Any error encountered during the query execution.
 *
 * @example
 * ```tsx
 * const { races, totalRaces, loading, error } = useRaces(1, 10, true);
 *
 * if (loading) return <p>Loading...</p>;
 * if (error) return <p>Error fetching races</p>;
 *
 * return (
 *   <ul>
 *     {races.map((race) => (
 *       <li key={race.id}>
 *         {race.name} - Speed: {race.speed}
 *       </li>
 *     ))}
 *   </ul>
 * );
 * ```
 */

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
