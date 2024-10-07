import { useEffect, useState } from 'react';



interface AbilityBonus {
  ability_score: {
    index: string;
    name: string;
  };
  bonus: number;
}

interface RaceData {
  name: string;
  alignment: string;
  ability_bonuses: AbilityBonus[];
}

function useRace(race: string) {
  const [data, setData] = useState<RaceData | null>(null);

  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/races/' + race)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error));
  }, [race]);

  return {
    name: data?.name || '',
    alignment: data?.alignment || '',
    abilityBonuses: data?.ability_bonuses || [],
  };
}

export default useRace;