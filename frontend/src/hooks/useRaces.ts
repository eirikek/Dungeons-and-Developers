import { useEffect, useState } from 'react';
import {gql, useQuery} from '@apollo/client';


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

function useRace(race: string) {
  const [data, setData] = useState<{
    name: string;
    alignment: string;
    abilityBonuses: string[];
    index: string;
  }>({
    name: '',
    alignment: '',
    abilityBonuses: [],
    index: '',
  });

  const { data, error, loading } = useQuery<{
    races: { races: Race[], totalRaces: number }
  }>(GET_RACES, {
    variables: {  offset, limit: monstersPerPage },
    fetchPolicy: 'network-only',
  });




  useEffect(() => {
    let isMounted = true;  // To avoid setting state on unmounted component

    // Fetch data only if the race changes
    if (race) {
      fetch('https://www.dnd5eapi.co/api/races/' + race)
        .then((response) => response.json())
        .then((json) => {
          if (isMounted) {
            setData(json);
          }
        })
        .catch((error) => console.log(error));
    }

    return () => {
      isMounted = false;  // Cleanup function
    };
  }, [race]);

  return {
    name: data.name,
    alignment: data.alignment,
    abilityBonuses: data.abilityBonuses,
    index: data.index,
  };
}

export default useRace;