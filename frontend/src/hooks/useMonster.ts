import { useQueries, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { defaultURL, monstersURL } from '../constants';

/**
 * Interface representing the structure of a Monster object.
 */
export interface Monster {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  hit_points: number;
  hit_dice: string;
  strength: number;
  dexterity: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  image: string;
}

/**
 * Interface representing the structure of MonsterCardDataProps.
 */
export interface MonsterCardDataProps {
  index: string;
  name: string;
  type: string;
  hp: number;
  alignment: string;
  size: string;
  img?: string;
}

/**
 * Fetches the details of a monster from the API.
 * @param {string} monsterIndex - The index of the monster to fetch.
 * @returns {Promise<Monster>} - A promise that resolves to the monster data.
 * @throws Will throw an error if the request fails.
 */
export const fetchMonster = async (monsterIndex: string): Promise<Monster> => {
  try {
    const { data } = await axios.get(`${monstersURL}/${monsterIndex}`);
    return data;
  } catch (error) {
    console.error('Error fetching monster:', monsterIndex, error);
    throw error;
  }
};

/**
 * Maps the Monster data to MonsterCardDataProps.
 * @param {Monster} data - The monster data to map.
 * @returns {MonsterCardDataProps} - The mapped monster card data.
 */
const mapToCard = (data: Monster): MonsterCardDataProps => {
  return {
    index: data.index,
    name: data.name,
    type: data.type,
    hp: data.hit_points,
    alignment: data.alignment,
    size: data.size,
    img: data.image ? `${defaultURL}${data.image}` : undefined,
  };
};

/**
 * Custom hook to fetch multiple monsters' data using React Query.
 * @param {string | string[]} monsterIndexes - The index or indices of the monsters to fetch.
 * @param {boolean} [fullDetails=false] - Whether to fetch full details or just card data.
 * @returns {UseQueryResult<Monster | MonsterCardDataProps, Error>[]} - An array of query results.
 */
// based on https://tanstack.com/query/latest/docs/framework/react/guides/caching
// https://tanstack.com/query/latest/docs/framework/react/reference/useQueries
function useMonsters(
  monsterIndexes: string | string[],
  fullDetails: boolean = false
): UseQueryResult<Monster | MonsterCardDataProps, Error>[] {
  const isSingleMonster = typeof monsterIndexes === 'string';

  const queries = isSingleMonster
    ? [
        {
          queryKey: ['monster', monsterIndexes],
          queryFn: () => fetchMonster(monsterIndexes as string),
          staleTime: Infinity,
          gcTime: Infinity,
          select: (data: Monster) => (fullDetails ? data : mapToCard(data)),
        },
      ]
    : (monsterIndexes as string[]).map((index) => ({
        queryKey: ['monster', index],
        queryFn: () => fetchMonster(index),
        staleTime: Infinity,
        gcTime: Infinity,
        select: (data: Monster) => (fullDetails ? data : mapToCard(data)),
      }));

  return useQueries({ queries });
}

export default useMonsters;
