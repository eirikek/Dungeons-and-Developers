import { useMemo} from 'react';
import { gql, useQuery } from '@apollo/client';



const GET_ABILITYSCORES = gql`
    query GetAbilityScores($offset: Int, $limit: Int) {
        abilities(offset: $offset, limit: $limit) {
            abilities {
                index
                name
            }
            totalAbilities
        }
    }
`;
interface Description{
  desc: string;
}
interface AbilityData {
  name: string;
  index: string;
  desc: Description[];
}
function useAbilityScores(currentPage: number, abilitiesPerPage: number) {
  const offset = (currentPage - 1) * abilitiesPerPage;

  const { data, error, loading } = useQuery<{
    abilities: { abilities: AbilityData[], totalAbilities: number }
  }>(GET_ABILITYSCORES, {
    variables: { offset, limit: abilitiesPerPage },
    fetchPolicy: 'network-only',
  });


  const transformedAbilities = useMemo(() => {
    if (!data || !data.abilities) return [];
    return data.abilities.abilities.map(abilities => ({
      index: abilities.index,
      name: abilities.name,
      desc: abilities.desc

    }));
  }, [data]);


  return {
    abilities: transformedAbilities,
    totalAbilities: data?.abilities.totalAbilities || 0,
    loading,
    error,
  };
}

export default useAbilityScores;