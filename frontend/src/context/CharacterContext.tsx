import { useMutation, useReactiveVar } from '@apollo/client';
import { createContext, ReactNode, useCallback, useEffect } from 'react';
import { UPDATE_ABILITY_SCORES, UPDATE_USER_CLASS, UPDATE_USER_RACE } from 'src/graphql/queries.ts';
import AbilityScoreCardProps from 'src/interfaces/AbilityScoreProps.ts';
import useAbilityScores from '../hooks/useAbilityScores';
import useClass from '../hooks/useClasses.ts';
import useEquipments from '../hooks/useEquipments';
import useRaces from '../hooks/useRaces.ts';
import { useToast } from '../hooks/useToast';
import useUserEquipments from '../hooks/useUserEquipments';
import ClassProps from '../interfaces/ClassProps.ts';
import { Equipment } from '../interfaces/EquipmentProps.ts';
import RaceProps from '../interfaces/RaceProps.ts';
import {
  abilitiesVar,
  classesVar,
  equipmentsVar,
  racesVar,
  selectedClassIdVar,
  selectedRaceIdVar,
  userEquipmentsVar,
} from '../reactivevars/characterReactivevars.ts';

interface CharacterContextType {
  classes: ClassProps[];
  races: RaceProps[];
  abilities: AbilityScoreCardProps[];
  userEquipments: Equipment[];
  equipments: Equipment[];
  selectedClassId: string;
  selectedRaceId: string;
  updateClass: (classId: string) => Promise<void>;
  updateRace: (raceId: string) => Promise<void>;
  updateAbilities: (newAbilities: number[]) => Promise<void>;
  addEquipment: (equipmentId: string) => Promise<void>;
  removeEquipment: (equipmentId: string) => Promise<void>;
  removeAllEquipments: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

interface CharacterProviderProps {
  children: ReactNode;
  userId: string;
}

export const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider = ({ children, userId }: CharacterProviderProps) => {
  const { showToast } = useToast();

  const { classes, loading: classesLoading, error: classesError } = useClass(1, 12);
  const { races, loading: racesLoading, error: racesError } = useRaces(1, 9);
  const { abilities, loading: abilitiesLoading, error: abilitiesError } = useAbilityScores(1, 6);
  const { equipments: fetchedEquipments, loading: equipmentsLoading } = useEquipments(1, 20);
  const {
    userEquipments,
    loading: userEquipmentsLoading,
    addToEquipments,
    removeFromEquipments,
    removeAllUserEquipments,
  } = useUserEquipments();

  const [updateUserRace] = useMutation(UPDATE_USER_RACE);
  const [updateUserClass] = useMutation(UPDATE_USER_CLASS);
  const [updateUserAbilities] = useMutation(UPDATE_ABILITY_SCORES);

  useEffect(() => {
    if (classes.length > 0) classesVar(classes);
  }, [classes]);

  useEffect(() => {
    if (races.length > 0) {
      racesVar(races);
      const initialRaceId = races[0]?.id || '';
      selectedRaceIdVar(initialRaceId);
    }
  }, [races]);

  useEffect(() => {
    if (abilities.length > 0) {
      const initialScores = abilities.map((ability) => ({ ...ability, score: 0 }));
      abilitiesVar(initialScores);
    }
  }, [abilities]);

  useEffect(() => {
    if (fetchedEquipments.length > 0) equipmentsVar(fetchedEquipments);
  }, [fetchedEquipments]);

  useEffect(() => {
    userEquipmentsVar(userEquipments);
  }, [userEquipments]);

  const checkUserLoggedIn = useCallback(
    (actionName: string) => {
      if (!userId) {
        showToast({
          message: `You must be logged in to ${actionName}.`,
          type: 'error',
          duration: 3000,
        });
        throw new Error(`User not logged in for action: ${actionName}`);
      }
    },
    [showToast, userId]
  );

  const updateClass = useCallback(
    async (classId: string) => {
      checkUserLoggedIn('update the class');
      try {
        selectedClassIdVar(classId);
        await updateUserClass({ variables: { userId, classId } });
        showToast({
          message: 'Class updated successfully.',
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error updating class:', error);
        showToast({
          message: 'Failed to update class.',
          type: 'error',
          duration: 3000,
        });
      }
    },
    [checkUserLoggedIn, showToast, updateUserClass, userId]
  );

  const updateRace = useCallback(
    async (raceId: string) => {
      checkUserLoggedIn('update the race');
      try {
        selectedRaceIdVar(raceId);
        await updateUserRace({ variables: { userId, raceId } });

        showToast({
          message: 'Race updated successfully.',
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error updating race:', error);
        showToast({
          message: 'Failed to update race.',
          type: 'error',
          duration: 3000,
        });
      }
    },
    [checkUserLoggedIn, showToast, updateUserRace, userId]
  );

  const updateAbilities = useCallback(
    async (newAbilities: number[]) => {
      checkUserLoggedIn('update abilities');
      try {
        abilitiesVar(newAbilities);
        await updateUserAbilities({ variables: { userId, scores: newAbilities } });
        showToast({
          message: 'Abilities updated successfully.',
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error updating abilities:', error);
        showToast({
          message: 'Failed to update abilities.',
          type: 'error',
          duration: 3000,
        });
      }
    },
    [checkUserLoggedIn, showToast, updateUserAbilities, userId]
  );

  const addEquipment = useCallback(
    async (equipmentId: string) => {
      checkUserLoggedIn('add equipment');
      try {
        await addToEquipments(equipmentId);
        showToast({
          message: 'Equipment added successfully.',
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error adding equipment:', error);
        showToast({
          message: 'Failed to add equipment.',
          type: 'error',
          duration: 3000,
        });
      }
    },
    [addToEquipments, checkUserLoggedIn, showToast]
  );

  const removeEquipment = useCallback(
    async (equipmentId: string) => {
      checkUserLoggedIn('remove equipment');
      try {
        await removeFromEquipments(equipmentId);
        showToast({
          message: 'Equipment removed successfully.',
          type: 'info',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error removing equipment:', error);
        showToast({
          message: 'Failed to remove equipment.',
          type: 'error',
          duration: 3000,
        });
      }
    },
    [checkUserLoggedIn, removeFromEquipments, showToast]
  );

  const removeAllEquipments = useCallback(async () => {
    checkUserLoggedIn('remove all equipment');
    try {
      await removeAllUserEquipments();
      showToast({
        message: 'All equipments removed successfully.',
        type: 'info',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error removing all equipments:', error);
      showToast({
        message: 'Failed to remove all equipments.',
        type: 'error',
        duration: 3000,
      });
    }
  }, [checkUserLoggedIn, removeAllUserEquipments, showToast]);

  const loading = classesLoading || racesLoading || abilitiesLoading || equipmentsLoading || userEquipmentsLoading;
  const error = classesError || racesError || abilitiesError || null;

  return (
    <CharacterContext.Provider
      value={{
        classes: useReactiveVar(classesVar),
        races: useReactiveVar(racesVar),
        abilities: useReactiveVar(abilitiesVar),
        userEquipments: useReactiveVar(userEquipmentsVar),
        equipments: useReactiveVar(equipmentsVar),
        selectedClassId: useReactiveVar(selectedClassIdVar),
        selectedRaceId: useReactiveVar(selectedRaceIdVar),
        updateClass,
        updateRace,
        updateAbilities,
        addEquipment,
        removeEquipment,
        removeAllEquipments,
        loading,
        error,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};
