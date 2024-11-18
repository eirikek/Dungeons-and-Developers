// src/reactiveVars/CharacterReactiveVars.ts
import { makeVar } from '@apollo/client';
import { Equipment } from '../interfaces/EquipmentProps';
import ClassData from '../interfaces/ClassProps';
import RaceProps from '../interfaces/RaceProps';
import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';

export const selectedClassIdVar = makeVar<string>('');

export const selectedRaceIdVar = makeVar<string>('');

export const abilitiesVar = makeVar<AbilityScoreCardProps[]>([
  {
    id: '1', // Assign unique or placeholder ID
    name: 'Strength',
    index: 'STR',
    score: 0,
    skills: ['Athletics'],
  },
  {
    id: '2',
    name: 'Dexterity',
    index: 'DEX',
    score: 0,
    skills: ['Acrobatics', 'Stealth'],
  },
  {
    id: '3',
    name: 'Constitution',
    index: 'CON',
    score: 0,
    skills: [],
  },
  {
    id: '4',
    name: 'Intelligence',
    index: 'INT',
    score: 0,
    skills: ['Arcana', 'History'],
  },
  {
    id: '5',
    name: 'Wisdom',
    index: 'WIS',
    score: 0,
    skills: ['Insight', 'Perception'],
  },
  {
    id: '6',
    name: 'Charisma',
    index: 'CHA',
    score: 0,
    skills: ['Persuasion', 'Deception'],
  },
]);

export const userEquipmentsVar = makeVar<Equipment[]>([]);

export const classesVar = makeVar<ClassData[]>([]);

export const racesVar = makeVar<RaceProps[]>([]);
export const equipmentsVar = makeVar<Equipment[]>([]);
export const equipmentsPageVar = makeVar<number>(0);
