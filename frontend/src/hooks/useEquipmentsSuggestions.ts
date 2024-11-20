import { useQuery } from '@apollo/client';
import { GET_EQUIPMENT_SUGGESTIONS } from '../graphql/equipmentQueries.ts';

function useEquipmentSuggestions(searchTerm: string) {
  const { data, loading, error } = useQuery(GET_EQUIPMENT_SUGGESTIONS, {
    variables: { searchTerm },
    skip: !searchTerm,
  });

  return {
    suggestions: data?.equipments || [],
    loading,
    error,
  };
}

export default useEquipmentSuggestions;
