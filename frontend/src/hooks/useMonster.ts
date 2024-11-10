import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import MonsterDataProps from '../interfaces/MonsterDataProps.ts';
import { GET_MONSTERS } from '../../../backend/src/graphql/queries.ts';

function useMonster(
  searchTerm: string,
  currentPage: number,
  monstersPerPage: number,
  selectedFilters: Set<string>,
  hpRange: [number, number]
) {
  const offset = (currentPage - 1) * monstersPerPage;

  const { data, error, loading } = useQuery<{
    monsters: { monsters: MonsterDataProps[]; totalMonsters: number };
  }>(GET_MONSTERS, {
    variables: { searchTerm, offset, limit: monstersPerPage, types: Array.from(selectedFilters) },
    fetchPolicy: 'network-only',
  });

  const [globalMinHp, setGlobalMinHp] = useState<number>(0);
  const [globalMaxHp, setGlobalMaxHp] = useState<number>(1000);

  useEffect(() => {
    if (data && data.monsters) {
      const allMonsters = data.monsters.monsters;
      const minHp = Math.min(...allMonsters.map((m) => m.hit_points));
      const maxHp = Math.max(...allMonsters.map((m) => m.hit_points));
      setGlobalMinHp(minHp);
      setGlobalMaxHp(maxHp);
    }
  }, [data]);

  const transformedMonsters = useMemo(() => {
    if (!data || !data.monsters) return [];
    const filteredMonsters = data.monsters.monsters.filter(
      (monster) =>
        selectedFilters.size === 0 ||
        (selectedFilters.has(monster.type) && monster.hit_points >= hpRange[0] && monster.hit_points <= hpRange[1])
    );

    return filteredMonsters.map((monster) => ({
      id: monster.id,
      name: monster.name,
      type: monster.type,
      hp: monster.hit_points,
      alignment: monster.alignment,
      size: monster.size,
      img: monster.image,
    }));
  }, [data, selectedFilters, hpRange]);

  return {
    monsters: transformedMonsters,
    totalMonsters: data?.monsters.totalMonsters || 0,
    minHp: globalMinHp,
    maxHp: globalMaxHp,
    loading,
    error,
  };
}

export default useMonster;
