import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { Equipment } from '../interfaces/EquipmentProps';
import { GET_EQUIPMENTS } from '../graphql/queries/equipmentQueries.ts';
import { handleError } from '../utils/handleError.ts';

/**
 * Custom Hook: `useEquipments`
 *
 * Fetches and manages equipment data, supporting pagination and search functionality.
 *
 * Features:
 * - Fetches equipment data from the backend using Apollo Client's `useQuery`.
 * - Supports search functionality with the `searchTerm` parameter.
 * - Handles paginated data with `currentPage` and `equipmentsPerPage`.
 * - Includes error handling and data transformation for use in the UI.
 *
 * Dependencies:
 * - `GET_EQUIPMENTS`: GraphQL query for fetching equipment data.
 * - `handleError`: Utility function for logging and managing errors.
 *
 * @param searchTerm The search term to filter equipments.
 * @param currentPage The current page number for paginated data.
 * @param equipmentsPerPage The number of equipments per page.
 * @param shouldFetch A boolean indicating whether to fetch data or not.
 *
 * @returns An object containing:
 * - `equipments`: A transformed list of equipment objects.
 * - `totalEquipments`: The total number of equipments available.
 * - `loading`: A boolean indicating if the data is currently being loaded.
 * - `error`: Any error encountered during data fetching.
 *
 * @example
 * ```tsx
 * const { equipments, totalEquipments, loading, error } = useEquipments('sword', 1, 10, true);
 *
 * if (loading) return <p>Loading...</p>;
 * if (error) return <p>Error loading equipments.</p>;
 *
 * return (
 *   <ul>
 *     {equipments.map((equipment) => (
 *       <li key={equipment.id}>{equipment.name}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */

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
