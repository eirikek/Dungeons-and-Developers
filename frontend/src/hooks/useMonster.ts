import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Monster {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  hitPoints: number;
  hitDice: string;
  strength: number;
  dexterity: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  image: string;
}

export interface MonsterCardDataProps {
  index: string;
  name: string;
  type: string;
  hp: number;
  alignment: string;
  size: string;
  img: string;
}

const fetchMonster = async (monsterIndex: string): Promise<Monster> => {
  const { data } = await axios.get<Monster>(`https://www.dnd5eapi.co/api/monsters/${monsterIndex}`);
  return data;
};

function useMonster(monsterIndex: string, fullDetails: boolean = false) {
  return useQuery<Monster, Error, MonsterCardDataProps | Monster>({
    queryKey: ['monster', monsterIndex],
    queryFn: () => fetchMonster(monsterIndex),
    staleTime: Infinity, // Cache the data indefinitely
    select: fullDetails
      ? (data: Monster): Monster => ({
          index: data.index,
          name: data.name,
          size: data.size,
          type: data.type,
          alignment: data.alignment,
          hitPoints: data.hitPoints,
          hitDice: data.hitDice,
          strength: data.strength,
          dexterity: data.dexterity,
          intelligence: data.intelligence,
          wisdom: data.wisdom,
          charisma: data.charisma,
          image: data.image,
        })
      : (data: Monster): MonsterCardDataProps => ({
          index: data.index,
          name: data.name,
          type: data.type,
          hp: data.hitPoints,
          alignment: data.alignment,
          size: data.size,
          img: data.image,
        }),
  });
}

export default useMonster;
