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

/**
 * Custom Hook: `useUserEquipments`
 *
 * Manages equipment-related operations for a user, including fetching, adding, and removing equipment.
 *
 * Features:
 * - Fetches the user's current equipment from the server and updates the Apollo cache.
 * - Provides mutations to add, remove, or clear all equipment for a user.
 * - Ensures the local equipment state is synchronized with the server.
 *
 * Dependencies:
 * - GraphQL Queries:
 *   - `GET_USER_EQUIPMENT`: Fetches the user's equipment.
 * - GraphQL Mutations:
 *   - `ADD_EQUIPMENT_TO_CHARACTER`: Adds an equipment item to the user's list.
 *   - `REMOVE_EQUIPMENT_FROM_CHARACTER`: Removes a specific equipment item.
 *   - `REMOVE_ALL_EQUIPMENTS`: Clears all equipment for the user.
 * - Utilities:
 *   - `equipmentsVar`: Reactive variable for managing equipment state.
 *   - `handleError`: Error handling utility for logging and displaying errors.
 *
 * State:
 * - `loading`: Boolean indicating whether data is currently being fetched.
 *
 * Returns:
 * - `loading`: Indicates if the equipment data is loading.
 * - `addToEquipmentsMutation`: Adds a specific equipment item to the user.
 * - `removeFromEquipmentsMutation`: Removes a specific equipment item from the user.
 * - `removeAllUserEquipmentsMutation`: Removes all equipment from the user.
 *
 * @example
 * ```tsx
 * import useUserEquipments from '../hooks/useUserEquipments';
 *
 * const MyComponent = () => {
 *   const {
 *     loading,
 *     addToEquipmentsMutation,
 *     removeFromEquipmentsMutation,
 *     removeAllUserEquipmentsMutation,
 *   } = useUserEquipments();
 *
 *   if (loading) return <p>Loading...</p>;
 *
 *   return (
 *     <div>
 *       <button onClick={() => addToEquipmentsMutation('equipmentId')}>
 *         Add Equipment
 *       </button>
 *       <button onClick={() => removeFromEquipmentsMutation('equipmentId')}>
 *         Remove Equipment
 *       </button>
 *       <button onClick={removeAllUserEquipmentsMutation}>
 *         Remove All Equipment
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 */

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
      const backendEquipments = data.user.equipments || [];
      const currentEquipments = equipmentsVar();

      if (JSON.stringify(currentEquipments) !== JSON.stringify(backendEquipments)) {
        equipmentsVar(backendEquipments);
      }
      setLoading(false);
    }
  }, [data]);

  const [addEquipment] = useMutation(ADD_EQUIPMENT_TO_CHARACTER, {
    update(cache, { data }) {
      if (!data || !data.addEquipmentToCharacter || !data.addEquipmentToCharacter.equipments) {
        handleError(null, 'Invalid mutation response for adding equipment.', 'warning');
        return;
      }
      const addedEquipments = data.addEquipmentToCharacter.equipments || [];
      const currentEquipments = equipmentsVar();

      const updatedEquipments = [...currentEquipments, ...addedEquipments];
      equipmentsVar(updatedEquipments);

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            id: userId,
            equipments: updatedEquipments,
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

      const removedEquipments = data.removeEquipmentFromCharacter.equipments || [];
      const currentEquipments = equipmentsVar();

      const updatedEquipments = [...currentEquipments, ...removedEquipments];
      equipmentsVar(updatedEquipments);

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            id: userId,
            equipments: updatedEquipments,
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
      const equipmentsRemove = data.removeAllEquipments.equipments || [];

      const updatedEquipments = [...equipmentsRemove];

      equipmentsVar(updatedEquipments);

      cache.writeQuery<GetUserEquipmentResponse>({
        query: GET_USER_EQUIPMENT,
        variables: { userId },
        data: {
          user: {
            id: userId,
            equipments: updatedEquipments,
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
