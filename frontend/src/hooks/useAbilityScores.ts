import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_ABILITYSCORES } from '../graphql/queries/abilityScoreQueries.ts';
import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';
import { handleError } from '../utils/handleError.ts';

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
