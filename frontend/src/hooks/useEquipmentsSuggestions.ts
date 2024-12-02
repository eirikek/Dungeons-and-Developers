import { useQuery } from '@apollo/client';
import { GET_EQUIPMENT_SUGGESTIONS } from '../graphql/queries/equipmentQueries.ts';
import { handleError } from '../utils/handleError.ts';

function useEquipmentSuggestions(searchTerm: string) {
  const { data, loading, error } = useQuery(GET_EQUIPMENT_SUGGESTIONS, {
    variables: { searchTerm },
    skip: !searchTerm,
    onError: (err) => {
      handleError(err, 'Equipments suggestions not fetched', 'critical');
    },
  });

  return {
    suggestions: data?.equipments || [],
    loading,
    error,
  };
}

export default useEquipmentSuggestions;
