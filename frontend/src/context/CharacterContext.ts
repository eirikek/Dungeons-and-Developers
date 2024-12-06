import { createContext, useContext } from 'react';
import { CharacterContextType } from '../interfaces/CharacterContextProps.ts';

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
