import { useEffect, useState } from 'react';

interface Rule {
  name: string;
  desc: string[];
  index: string;
}

function useRules() {
  const [data, setData] = useState<Rule[]>([]);

  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/rules')
      .then((response) => response.json())
      .then((json) => setData(json.results))
      .catch((error) => console.log(error));
  }, []);

  return data;
}

export default useRules;