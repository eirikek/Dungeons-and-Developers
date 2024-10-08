import { useEffect, useState } from 'react';



function useRace(race: string) {
  const [data, setData] = useState<{
    name: string;
    alignment: string;
    abilityBonuses: string[];
    index:string;
  }>({
    name: '',
    alignment: '',
    abilityBonuses: [],
    index:'',
  });


  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/races/' + race)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error));
  }, [race]);

  return {
    name: data.name,
    alignment: data.alignment,
    abilityBonuses: data.abilityBonuses,
    index: data.index,
  };
}

export default useRace;