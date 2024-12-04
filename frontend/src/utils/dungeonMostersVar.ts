import { makeVar } from '@apollo/client';
import { MonsterCardProps } from '../interfaces/MonsterCardProps.ts';

export const dungeonMonstersVar = makeVar<MonsterCardProps[]>([]);
