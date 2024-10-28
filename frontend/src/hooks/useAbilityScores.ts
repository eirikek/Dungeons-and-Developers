import { useMemo} from 'react';
import { gql, useQuery } from '@apollo/client';



const GET_ABILITYSCORES = gql`
    query GetAbilityScores($offset: Int, $limit: Int) {
        abilities(offset: $offset, limit: $limit) {
            abilities {
                index
                name
                desc
                skills
            }
            totalAbilities
        }
    }
`;
interface Description{
  desc: string;
}
interface Skill{
  name: string;
  index: string;
}
interface AbilityData {
  name: string;
  index: string;
  desc: Description[];
  skills: Skill[];
}
function useAbilityScores(currentPage: number, abilitiesPerPage: number) {
  const offset = (currentPage - 1) * abilitiesPerPage;

  const { data, error, loading } = useQuery<{
    abilities: { abilities: AbilityData[], totalAbilities: number }
  }>(GET_ABILITYSCORES, {
    variables: { offset, limit: abilitiesPerPage },
    fetchPolicy: 'network-only',
  });
  console.log('GraphQL Response:', data);


  const transformedAbilities = useMemo(() => {
    if (!data || !data.abilities) return [];
    return data.abilities.abilities.map(ability => ({
      index: ability.index,
      name: ability.name,
      desc: Array.isArray(ability.desc) ? ability.desc : [],
      skills: Array.isArray(ability.skills) ? ability.skills: []
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