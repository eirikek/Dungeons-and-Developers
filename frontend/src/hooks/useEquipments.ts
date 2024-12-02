import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { Equipment } from '../interfaces/EquipmentProps';
import { GET_EQUIPMENTS } from '../graphql/queries/equipmentQueries.ts';
import { handleError } from '../utils/handleError.ts';

function useEquipments(searchTerm: string, currentPage: number, equipmentsPerPage: number, shouldFetch: boolean) {
  const offset = (currentPage - 1) * equipmentsPerPage;

  const { data, error, loading } = useQuery<{
    equipments: { equipments: Equipment[]; totalCount: number };
  }>(GET_EQUIPMENTS, {
    variables: { searchTerm, offset, limit: equipmentsPerPage },
    skip: !shouldFetch,
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      if (err) {
        handleError(err, `Error fetching equipments. SearchTerm: "${searchTerm}", Page: ${currentPage}`, 'critical');
      }
    },
  });

  const transformedEquipments = useMemo(() => {
    if (loading) {
      return [];
    }

    if (error) {
      handleError(error, 'Error fetching equipments', 'critical');
      return [];
    }

    if (!data || !data.equipments) {
      if (!shouldFetch) return [];
      handleError(null, 'No data received for equipments after loading', 'warning');
      return [];
    }
    return data.equipments.equipments.map((equipment) => ({
      id: equipment.id,
      index: equipment.index,
      name: equipment.name,
      category: equipment.category,
      value: equipment.value,
    }));
  }, [data, error, loading, shouldFetch]);

  return {
    equipments: transformedEquipments,
    totalEquipments: data?.equipments.totalCount || 0,
    loading,
    error,
  };
}

export default useEquipments;
