import AbilityScoreCardProps from './AbilityScoreProps.ts';
import ClassData from './ClassProps.ts';
import RaceData from './RaceProps.ts';
import { Equipment } from './EquipmentProps.ts';
import { ReactNode } from 'react';

export interface CharacterContextType {
  stateAbilities: AbilityScoreCardProps[];
  userAbilityScores: Map<string, number>;
  updateAbilityScores: (newValue: number, updatedAbilityName: string) => Promise<void>;
  classes: ClassData[];
  updateClass: (classId: string) => Promise<void>;
  races: RaceData[];
  updateRace: (raceId: string) => Promise<void>;
  addToEquipments: (equipment: Equipment) => void;
  removeFromEquipments: (equipment: Equipment) => void;
  removeAllEquipments: () => void;
  loadingStates: LoadingStates;
}

export interface LoadingStates {
  abilityScoresLoading: boolean;
  classLoading: boolean;
  raceLoading: boolean;
  equipmentsLoading: boolean;
}

export interface CharacterProviderProps {
  children: ReactNode;
  userId: string;
}
