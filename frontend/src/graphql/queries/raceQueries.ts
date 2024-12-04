import { gql } from '@apollo/client';

/**
 * Race Queries
 *
 * Features:
 * - Fetches paginated lists of races along with their attributes.
 *
 * Queries:
 *
 * - `GET_RACES`: Fetches a paginated list of races.
 *   - Query Parameters:
 *     - `offset` (optional): Number of records to skip for pagination.
 *     - `limit` (optional): Maximum number of records to retrieve.
 *   - Query Response:
 *     - `races`: Array of race objects with:
 *       - `id`: Unique identifier for the race.
 *       - `index`: Index of the race in the dataset.
 *       - `name`: Name of the race.
 *       - `speed`: Base speed of the race.
 *       - `alignment`: Typical alignment of the race.
 *       - `size`: Size category of the race.
 *     - `totalRaces`: Total number of races available.
 */

export const GET_RACES = gql`
  query GetRaces($offset: Int, $limit: Int) {
    races(offset: $offset, limit: $limit) {
      races {
        id
        index
        name
        speed
        alignment
        size
      }
      totalRaces
    }
  }
`;
