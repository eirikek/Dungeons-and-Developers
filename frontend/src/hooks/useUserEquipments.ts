import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import { useMutation, useQuery } from '@apollo/client';

import { Equipment } from '../interfaces/EquipmentProps.ts';
import { GET_USER_EQUIPMENT } from '../graphql/queries/userQueries.ts';
import {
  ADD_EQUIPMENT_TO_CHARACTER,
  REMOVE_ALL_EQUIPMENTS,
  REMOVE_EQUIPMENT_FROM_CHARACTER,
} from '../graphql/mutations/userMutations.ts';
import { useLocation } from 'react-router-dom';
import { handleError } from '../utils/handleError.ts';
import { GetUserEquipmentResponse } from '../graphql/queryInterface.ts';

const useUserEquipments = () => {
  const { userId } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  const shouldFetchUserEquipments = currentPath.includes('/equipment') || currentPath.includes('/mycharacter');

  const [userEquipments, setUserEquipments] = useState<Equipment[]>([]);

  const [loading, setLoading] = useState(true);

  const { data } = useQuery(GET_USER_EQUIPMENT, {
    variables: { userId },
    skip: !userId || !shouldFetchUserEquipments,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data?.user) {
      setUserEquipments(data.user.equipments || []);
      setLoading(false);
    }
  }, [data]);

  const [addEquipment] = useMutation(ADD_EQUIPMENT_TO_CHARACTER, {
    update(cache, { data }) {
      if (!data || !data.addEquipmentToCharacter || !data.addEquipmentToCharacter.equipments) {
        handleError(null, 'Invalid mutation response for adding equipment.', 'warning');
        return;
      }

      const newEquipment = data.addEquipmentToCharacter.equipments.slice(-1)[0]; // Get the last element
      if (!newEquipment) {
        handleError(null, 'New equipment is undefined.', 'warning');
        return;
      }

      const existingData = cache.readQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
      });

      if (!existingData) {
        handleError(null, 'No existing cache data found for equipments.', 'warning');
        return;
      }

      const updatedEquipments = [...(existingData.user.equipments || []), newEquipment];

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            ...existingData.user,
            equipments: updatedEquipments,
          },
        },
      });
    },
    onError: (error) => handleError(error, 'Failed to add equipment.', 'critical'),
  });

  const [removeEquipment] = useMutation(REMOVE_EQUIPMENT_FROM_CHARACTER, {
    update(cache, { data }) {
      if (!data) {
        handleError(null, 'Invalid mutation response for removing equipment.', 'warning');
        return;
      }

      const existingData = cache.readQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
      });
      if (!existingData) {
        handleError(null, 'No existing cache data found for equipments.', 'warning');
        return;
      }

      const removedEquipmentId = data.removeEquipmentFromCharacter.equipmentId;
      const updatedEquipments = existingData.user.equipments.filter((equip) => equip.id !== removedEquipmentId);

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            ...existingData.user,
            equipments: updatedEquipments,
          },
        },
      });
    },
    onError: (error) => handleError(error, 'Failed to remove equipment.', 'critical'),
  });

  const [removeAllEquipments] = useMutation(REMOVE_ALL_EQUIPMENTS, {
    update(cache) {
      const existingData = cache.readQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
      });
      if (!existingData) {
        handleError(null, 'No existing cache data found for equipments.', 'warning');
        return;
      }

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            ...existingData.user,
            equipments: [],
          },
        },
      });
    },
    onError: (error) => handleError(error, 'Failed to remove all equipments.', 'critical'),
  });

  const addToEquipmentsMutation = async (equipId: string) => {
    try {
      await addEquipment({ variables: { userId, equipmentId: equipId } });
    } catch (error) {
      handleError(error, 'Failed to execute add equipment mutation.', 'critical');
    }
  };

  const removeFromEquipmentsMutation = async (equipId: string) => {
    try {
      await removeEquipment({ variables: { userId, equipmentId: equipId } });
    } catch (error) {
      handleError(error, 'Failed to execute remove equipment mutation.', 'critical');
    }
  };

  const removeAllUserEquipmentsMutation = async () => {
    try {
      if (!userId || userEquipments.length === 0) return;
      await removeAllEquipments({ variables: { userId } });
    } catch (error) {
      handleError(error, 'Failed to execute remove all equipments mutation.', 'critical');
    }
  };
  return {
    userEquipments,
    loading,
    addToEquipmentsMutation,
    removeFromEquipmentsMutation,
    removeAllUserEquipmentsMutation,
  };
};

export default useUserEquipments;
