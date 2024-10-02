import { useEffect, useState } from 'react';

function useMonster(monsterName: string) {
  const [data, setData] = useState<{
    name: string;
    type: string;
    image: string;
    alignment: string;
    hit_points: number;
  }>({
    name: '',
    type: '',
    image: '',
    alignment: '',
    hit_points: 0,
  });

  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/monsters/' + monsterName)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error));
  }, [monsterName]);

  return {
    name: data.name,
    type: data.type,
    img: data.image,
    alignment: data.alignment,
    hp: data.hit_points,
  };
}

export default useMonster;
