import { gql } from '@apollo/client';

/**
 * Equipment Queries
 *
 * Features:
 * - Fetches a list of equipment based on search criteria.
 * - Retrieves equipment suggestions for search autocomplete.
 * - Supports pagination for detailed equipment listings.
 *
 */

/**
 * - `GET_EQUIPMENT_SUGGESTIONS`: Retrieves equipment suggestions based on a search term.
 *   - Query Parameters:
 *     - `searchTerm` (required): The term to search for equipment suggestions.
 *   - Query Response:
 *     - `equipments`: Contains a list of equipment suggestions with:
 *       - `id`: The unique identifier of the equipment.
 *       - `name`: The name of the equipment.
 *     - `totalCount`: The total number of suggestions available.
 */

export const GET_EQUIPMENT_SUGGESTIONS = gql`
  query GetEquipmentSuggestions($searchTerm: String!) {
    equipments(searchTerm: $searchTerm, suggestionsOnly: true) {
      equipments {
        id
        name
      }
      totalCount
    }
  }
`;

/**
 * - `GET_EQUIPMENTS`: Retrieves a paginated list of equipment based on a search term.
 *   - Query Parameters:
 *     - `searchTerm` (optional): The term to filter equipment by name.
 *     - `offset` (optional): The number of records to skip for pagination.
 *     - `limit` (optional): The maximum number of records to retrieve.
 *   - Query Response:
 *     - `equipments`: Contains a list of equipment objects with:
 *       - `id`: The unique identifier for the equipment.
 *       - `index`: The index identifier for the equipment.
 *       - `name`: The name of the equipment.
 *       - `category`: The category of the equipment.
 *       - `value`: The value or cost of the equipment.
 *     - `totalCount`: The total number of equipment items available.
 */
export const GET_EQUIPMENTS = gql`
  query GetEquipments($searchTerm: String, $offset: Int, $limit: Int) {
    equipments(searchTerm: $searchTerm, offset: $offset, limit: $limit) {
      equipments {
        id
        index
        name
        category
        value
      }
      totalCount
    }
  }
`;
