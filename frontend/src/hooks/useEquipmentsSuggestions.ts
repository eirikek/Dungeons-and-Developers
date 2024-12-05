import { useQuery } from '@apollo/client';
import { GET_EQUIPMENT_SUGGESTIONS } from '../graphql/queries/equipmentQueries.ts';
import { handleError } from '../utils/handleError.ts';

/**
 * Custom Hook: `useEquipmentSuggestions`
 *
 * Fetches equipment suggestions based on a search term using Apollo Client.
 *
 * Features:
 * - Sends a GraphQL query to retrieve a list of equipment suggestions.
 * - Supports error handling via `handleError` utility.
 * - Skips fetching if the `searchTerm` is empty.
 *
 * Dependencies:
 * - `GET_EQUIPMENT_SUGGESTIONS`: GraphQL query to fetch equipment suggestions.
 * - `handleError`: Utility function to log and manage errors.
 *
 * @param searchTerm The search term used to fetch equipment suggestions.
 *
 * @returns An object containing:
 * - `suggestions`: An array of equipment suggestions (default is an empty array if no data is available).
 * - `loading`: A boolean indicating if the data is currently being fetched.
 * - `error`: Any error encountered during the query execution.
 *
 * @example
 * ```tsx
 * const { suggestions, loading, error } = useEquipmentSuggestions('sword');
 *
 * if (loading) return <p>Loading suggestions...</p>;
 * if (error) return <p>Error fetching suggestions.</p>;
 *
 * return (
 *   <ul>
 *     {suggestions.map((equipment) => (
 *       <li key={equipment.id}>{equipment.name}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */

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
