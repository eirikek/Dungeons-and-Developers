// abilitiesVar.ts
import { makeVar } from '@apollo/client';
import { Equipment } from '../interfaces/EquipmentProps.ts';

export const abilitiesVar = makeVar<Map<string, number>>(new Map());
export const equipmentsVar = makeVar<Equipment[]>([]);
export const raceVar = makeVar<string>('');
export const classVar = makeVar<string>('');
