import AbilityScoreCardProps from '../interfaces/AbilityScoreProps.ts';
import ClassData from '../interfaces/ClassProps.ts';
import RaceData from '../interfaces/RaceProps.ts';
import { Equipment } from '../interfaces/EquipmentProps.ts';
import { createContext, useContext } from 'react';

interface CharacterContextType {
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

interface LoadingStates {
  abilityScoresLoading: boolean;
  classLoading: boolean;
  raceLoading: boolean;
  equipmentsLoading: boolean;
}

export const CharacterContext = createContext<CharacterContextType>({
  stateAbilities: [],
  userAbilityScores: new Map<string, number>(),
  updateAbilityScores: async () => Promise.resolve(),
  classes: [],
  updateClass: async () => Promise.resolve(),
  races: [],
  updateRace: async () => Promise.resolve(),
  addToEquipments: () => {},
  removeFromEquipments: () => {},
  removeAllEquipments: () => {},
  loadingStates: {
    equipmentsLoading: false,
    classLoading: false,
    abilityScoresLoading: false,
    raceLoading: false,
  },
});

export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterProvider');
  }
  return context;
};
