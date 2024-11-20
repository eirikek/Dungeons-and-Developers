import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_EQUIPMENT_TO_CHARACTER,
  GET_USER_EQUIPMENT,
  REMOVE_ALL_EQUIPMENTS,
  REMOVE_EQUIPMENT_FROM_CHARACTER,
} from '../graphql/queries';
import { Equipment } from '../interfaces/EquipmentProps.ts';

const useUserEquipments = () => {
  const { userId } = useContext(AuthContext);
  const [userEquipments, setUserEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { data, refetch } = useQuery(GET_USER_EQUIPMENT, {
    variables: { userId },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.user) {
      setUserEquipments(data.user.equipments || []);
      setLoading(false);
    }
  }, [data]);

  const [addEquipment] = useMutation(ADD_EQUIPMENT_TO_CHARACTER, {
    onCompleted: () => refetch(),
  });

  const [removeEquipment] = useMutation(REMOVE_EQUIPMENT_FROM_CHARACTER, {
    onCompleted: () => refetch(),
  });

  const [removeAllEquipments] = useMutation(REMOVE_ALL_EQUIPMENTS, {
    onCompleted: () => refetch(),
  });

  const addToEquipmentsMutation = async (equipId: string) => {
    await addEquipment({ variables: { userId, equipmentId: equipId } });
  };

  const removeFromEquipmentsMutation = async (equipId: string) => {
    await removeEquipment({ variables: { userId, equipmentId: equipId } });
  };

  const removeAllUserEquipmentsMutation = async () => {
    if (!userId || userEquipments.length === 0) return;
    await removeAllEquipments({ variables: { userId } });
  };
  return {
    userEquipments,
    loading,
    refetchEquipments: refetch,
    addToEquipmentsMutation,
    removeFromEquipmentsMutation,
    removeAllUserEquipmentsMutation,
  };
};

export default useUserEquipments;
