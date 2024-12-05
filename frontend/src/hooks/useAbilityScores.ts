import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_ABILITYSCORES } from '../graphql/queries/abilityScoreQueries.ts';
import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';
import { handleError } from '../utils/handleError.ts';

/**
 * Custom Hook: `useAbilityScores`
 *
 * Fetches and transforms ability scores using Apollo Client and GraphQL.
 *
 * Features:
 * - Fetches ability scores with pagination using the `GET_ABILITYSCORES` GraphQL query.
 * - Handles errors gracefully with `handleError` utility.
 * - Memoizes transformed ability scores for performance.
 *
 * @param currentPage - The current page number for pagination.
 * @param abilitiesPerPage - The number of ability scores to fetch per page.
 * @param shouldFetch - A boolean indicating whether the data should be fetched.
 *
 * @returns An object containing:
 * - `abilities`: A transformed array of ability scores, or an empty array if loading or error.
 * - `totalAbilities`: The total number of ability scores available in the database.
 * - `loading`: A boolean indicating whether the query is still loading.
 * - `error`: Any error encountered during the query execution.
 *
 * Usage:
 * ```tsx
 * const { abilities, totalAbilities, loading, error } = useAbilityScores(currentPage, 10, true);
 * ```
 */

function useAbilityScores(currentPage: number, abilitiesPerPage: number, shouldFetch: boolean) {
  const offset = (currentPage - 1) * abilitiesPerPage;

  const { data, error, loading } = useQuery<{
    abilities: { abilities: AbilityScoreCardProps[]; totalAbilities: number };
  }>(GET_ABILITYSCORES, {
    variables: { offset, limit: abilitiesPerPage },
    skip: !shouldFetch,
    fetchPolicy: 'cache-and-network',
  });

  const transformedAbilities = useMemo(() => {
    if (loading) {
      return [];
    }

    if (error) {
      handleError(error, 'Error fetching abilities', 'critical');
      return [];
    }

    if (!data || !data.abilities) {
      if (!shouldFetch) return [];
      handleError(null, 'No data received for abilities after loading', 'warning');
      return [];
    }
    return data.abilities.abilities.map((ability) => ({
      id: ability.id,
      index: ability.index,
      name: ability.name,
      skills: ability.skills,
    }));
  }, [data, error, loading, shouldFetch]);

  return {
    abilities: transformedAbilities,
    totalAbilities: data?.abilities.totalAbilities || 0,
    loading,
    error,
  };
}

export default useAbilityScores;
