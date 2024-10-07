import { useEffect, useState } from 'react';



function useClasses(className: string) {
  const [data, setData] = useState<{
    name: string;
    hit_die: number;

  }>({
    name: '',
    hit_die: 0,

  });


  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/classes/' + className)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error));
  }, [className]);

  return {
    name: data.name,
    hit_die: data.hit_die,

  };
}

export default useClasses;
