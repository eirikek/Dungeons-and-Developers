import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';
import { GET_ABILITYSCORES } from '../graphql/queries';

function useAbilityScores(currentPage: number, abilitiesPerPage: number) {
  const offset = (currentPage - 1) * abilitiesPerPage;

  const { data, error, loading } = useQuery<{
    abilities: { abilities: AbilityScoreCardProps[]; totalAbilities: number };
  }>(GET_ABILITYSCORES, {
    variables: { offset, limit: abilitiesPerPage },
    fetchPolicy: 'network-only',
  });

  const transformedAbilities = useMemo(() => {
    if (!data || !data.abilities) {
      return [];
    }
    return data.abilities.abilities.map((ability) => ({
      id: ability.id,
      index: ability.index,
      name: ability.name,
      skills: ability.skills,
    }));
  }, [data]);

  useEffect(() => {
    console.log('useAbilities', transformedAbilities);
  }, [transformedAbilities]);

  return {
    abilities: transformedAbilities,
    totalAbilities: data?.abilities.totalAbilities || 0,
    loading,
    error,
  };
}

export default useAbilityScores;
