import { gql } from '@apollo/client';

/**
 * Class Queries
 *
 * Features:
 * - Fetches a paginated list of classes with their associated details.
 *
 * Queries:
 * - `GET_CLASSES`: Retrieves classes with optional pagination parameters.
 *
 * Query Parameters:
 * - `offset` (optional): The number of records to skip for pagination.
 * - `limit` (optional): The maximum number of records to retrieve.
 *
 * Query Response:
 * - `classes`: Contains a list of class objects with the following fields:
 *   - `id`: The unique identifier for the class.
 *   - `index`: The index identifier for the class.
 *   - `name`: The name of the class.
 *   - `hit_die`: The hit dice associated with the class.
 *   - `skills`: A list of skills associated with the class.
 * - `totalClasses`: The total number of classes available.
 */

export const GET_CLASSES = gql`
  query GetClasses($offset: Int, $limit: Int) {
    classes(offset: $offset, limit: $limit) {
      classes {
        id
        index
        name
        hit_die
        skills
      }
      totalClasses
    }
  }
`;
