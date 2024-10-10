import { useEffect, useState } from 'react';

function useAbilityScores(abilityScoreName: string) {
  const [data, setData] = useState<{
    name: string;
    full_name: string;
    desc: string;
    skills: string[];
  }>({
    name: '',
    full_name: '',
    desc: '',
    skills: [],
  });


  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/ability-scores/' + abilityScoreName)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error));
  }, [abilityScoreName]);

  return {
    name: data.name,
    full_name: data.full_name,
    desc: data.desc,
    skills: data.skills,
  };
}

export default useAbilityScores;
