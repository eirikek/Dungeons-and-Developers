import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import { useMutation, useQuery } from '@apollo/client';

import { GET_USER_EQUIPMENT } from '../graphql/queries/userQueries.ts';
import {
  ADD_EQUIPMENT_TO_CHARACTER,
  REMOVE_ALL_EQUIPMENTS,
  REMOVE_EQUIPMENT_FROM_CHARACTER,
} from '../graphql/mutations/userMutations.ts';
import { useLocation } from 'react-router-dom';
import { handleError } from '../utils/handleError.ts';
import { GetUserEquipmentResponse } from '../graphql/queryInterface.ts';
import { equipmentsVar } from '../utils/apolloVars.ts';

const useUserEquipments = () => {
  const { userId } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  const shouldFetchUserEquipments = currentPath.includes('/equipment') || currentPath.includes('/mycharacter');

  const [loading, setLoading] = useState(true);

  const { data } = useQuery(GET_USER_EQUIPMENT, {
    variables: { userId },
    skip: !userId || !shouldFetchUserEquipments,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data?.user) {
      console.log(data.user.equipments);
      equipmentsVar(data.user.equipments || []);
      setLoading(false);
    }
  }, [data]);

  const [addEquipment] = useMutation(ADD_EQUIPMENT_TO_CHARACTER, {
    update(cache, { data }) {
      if (!data || !data.addEquipmentToCharacter || !data.addEquipmentToCharacter.equipments) {
        handleError(null, 'Invalid mutation response for adding equipment.', 'warning');
        return;
      }

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            ...data.addEquipmentToCharacter,
          },
        },
      });
    },
    onError: (error) => handleError(error, 'Failed to add equipment.', 'critical'),
  });

  const [removeEquipment] = useMutation(REMOVE_EQUIPMENT_FROM_CHARACTER, {
    update(cache, { data }) {
      if (!data || !data.removeEquipmentFromCharacter || !data.removeEquipmentFromCharacter.equipments) {
        handleError(null, 'Invalid mutation response for removing equipment.', 'warning');
        return;
      }

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            ...data.removeEquipmentFromCharacter,
          },
        },
      });
    },
    onError: (error) => handleError(error, 'Failed to remove equipment.', 'critical'),
  });

  const [removeAllEquipments] = useMutation(REMOVE_ALL_EQUIPMENTS, {
    update(cache, { data }) {
      if (!data || !data.removeAllEquipments || !data.removeAllEquipments.equipments) {
        handleError(data, 'Invalid mutation response for removing all equipments.', 'warning');
        return;
      }

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            ...data.removeAllEquipments,
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
      if (!userId || equipmentsVar().length === 0) return;
      await removeAllEquipments({ variables: { userId } });
    } catch (error) {
      handleError(error, 'Failed to execute remove all equipments mutation.', 'critical');
    }
  };
  return {
    loading,
    addToEquipmentsMutation,
    removeFromEquipmentsMutation,
    removeAllUserEquipmentsMutation,
  };
};

export default useUserEquipments;
