// src/reactiveVars/CharacterReactiveVars.ts
import { makeVar } from '@apollo/client';
import { Equipment } from '../interfaces/EquipmentProps';
import ClassData from '../interfaces/ClassProps';
import RaceProps from '../interfaces/RaceProps';
import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';

export const selectedClassIdVar = makeVar<string>('');

export const selectedRaceIdVar = makeVar<string>('');

export const abilitiesVar = makeVar<AbilityScoreCardProps[]>([
  { name: 'Strength', index: 'STR', score: 0, skills: ['Athletics'] },
  { name: 'Dexterity', index: 'DEX', score: 0, skills: ['Acrobatics', 'Stealth'] },
  { name: 'Constitution', index: 'CON', score: 0, skills: [] },
  { name: 'Intelligence', index: 'INT', score: 0, skills: ['Arcana', 'History'] },
  { name: 'Wisdom', index: 'WIS', score: 0, skills: ['Insight', 'Perception'] },
  { name: 'Charisma', index: 'CHA', score: 0, skills: ['Persuasion', 'Deception'] },
]);

export const userEquipmentsVar = makeVar<Equipment[]>([]);

export const classesVar = makeVar<ClassData[]>([]);

export const racesVar = makeVar<RaceProps[]>([]);
export const equipmentsVar = makeVar<Equipment[]>([]);
export const equipmentsPageVar = makeVar<number>(0);
