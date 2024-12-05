import { gql } from '@apollo/client';

/**
 * Ability Score Queries
 *
 * Features:
 * - Fetches a paginated list of ability scores with their associated details.
 *
 * Queries:
 * - `GET_ABILITYSCORES`: Retrieves ability scores with optional pagination parameters.
 *
 * Query Parameters:
 * - `offset` (optional): The number of records to skip for pagination.
 * - `limit` (optional): The maximum number of records to retrieve.
 *
 * Query Response:
 * - `abilities`: Contains a list of ability score objects with the following fields:
 *   - `index`: The unique identifier for the ability score.
 *   - `name`: The name of the ability score.
 *   - `skills`: A list of skills associated with the ability score.
 * - `totalAbilities`: The total number of ability scores available.
 */

export const GET_ABILITYSCORES = gql`
  query GetAbilityScores($offset: Int, $limit: Int) {
    abilities(offset: $offset, limit: $limit) {
      abilities {
        index
        name
        skills
      }
      totalAbilities
    }
  }
`;
