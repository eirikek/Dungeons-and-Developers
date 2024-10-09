import { useEffect, useState } from 'react';

interface EquipmentItem {

  name: string;

}

function useEquipment() {
  const [data, setData] = useState<{
    results: EquipmentItem[];

  }>({
    results:[]

  });


  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/equipment/' )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error));
  }, []);

  return data.results;

}

export default useEquipment;
