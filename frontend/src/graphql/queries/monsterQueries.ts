import { gql } from '@apollo/client';

/**
 * Monster Queries
 *
 * Features:
 * - Fetches paginated and filtered lists of monsters.
 * - Retrieves monster type counts and hit point ranges for filters.
 * - Provides monster suggestions for search and autocomplete.
 * - Fetches reviews associated with a specific monster.
 */

/**
 * - `GET_MONSTERS`: Fetches a paginated list of monsters based on various filter options.
 *   - Query Parameters:
 *     - `searchTerm` (optional): Filter monsters by name or related terms.
 *     - `offset` (optional): Number of records to skip for pagination.
 *     - `limit` (optional): Maximum number of records to retrieve.
 *     - `types` (optional): Filter by a list of monster types.
 *     - `minHp` (optional): Minimum hit points for filtering.
 *     - `maxHp` (optional): Maximum hit points for filtering.
 *     - `sortOption` (optional): Sorting option for monsters.
 *   - Query Response:
 *     - `monsters`: List of monster objects with:
 *       - `id`: Unique identifier.
 *       - `name`: Name of the monster.
 *       - `size`: Monster size category.
 *       - `type`: Type of monster.
 *       - `alignment`: Alignment of the monster.
 *       - `hit_points`: Total hit points.
 *       - `image`: URL of the monster's image.
 *       - `averageDifficulty`: Average difficulty rating.
 *       - `reviewsCount`: Number of reviews.
 *     - `totalMonsters`: Total number of monsters available.
 *     - `minHp` and `maxHp`: Minimum and maximum hit points across all monsters.
 */

export const GET_MONSTERS = gql`
  query GetMonsters(
    $searchTerm: String
    $offset: Int
    $limit: Int
    $types: [String!]
    $minHp: Int
    $maxHp: Int
    $sortOption: String
  ) {
    monsters(
      searchTerm: $searchTerm
      offset: $offset
      limit: $limit
      types: $types
      minHp: $minHp
      maxHp: $maxHp
      sortOption: $sortOption
    ) {
      monsters {
        id
        name
        size
        type
        alignment
        hit_points
        image
        averageDifficulty
        reviewsCount
      }
      totalMonsters
      minHp
      maxHp
    }
  }
`;

/**
 * - `GET_MONSTER_TYPE_COUNTS`: Fetches counts of monster types for given hit point ranges.
 *   - Query Parameters:
 *     - `minHp` (optional): Minimum hit points for filtering.
 *     - `maxHp` (optional): Maximum hit points for filtering.
 *   - Query Response:
 *     - `monsterTypeCounts`: Array of types with:
 *       - `type`: Monster type.
 *       - `count`: Count of monsters of this type.
 */
export const GET_MONSTER_TYPE_COUNTS = gql`
  query GetMonsterTypeCounts($minHp: Int, $maxHp: Int) {
    monsterTypeCounts(minHp: $minHp, maxHp: $maxHp) {
      type
      count
    }
  }
`;

/**
 * - `GET_MONSTER_HP_RANGE`: Retrieves the global range of hit points for all monsters.
 *   - Query Response:
 *     - `monsterHpRange`: Object with:
 *       - `minHp`: Minimum hit points.
 *       - `maxHp`: Maximum hit points.
 */
export const GET_MONSTER_HP_RANGE = gql`
  query GetMonsterHpRange {
    monsterHpRange {
      minHp
      maxHp
    }
  }
`;

/**
 * - `GET_MONSTER_SUGGESTIONS`: Provides monster suggestions for autocomplete or filtering.
 *   - Query Parameters:
 *     - `searchTerm` (optional): Filter suggestions by term.
 *     - `types` (optional): Restrict suggestions to specific monster types.
 *     - `minHp` (optional): Minimum hit points for filtering.
 *     - `maxHp` (optional): Maximum hit points for filtering.
 *   - Query Response:
 *     - `monsters`: List of suggested monsters with:
 *       - `id`: Unique identifier.
 *       - `name`: Monster name.
 */
export const GET_MONSTER_SUGGESTIONS = gql`
  query GetMonsterSuggestions($searchTerm: String, $types: [String!], $minHp: Int, $maxHp: Int) {
    monsters(searchTerm: $searchTerm, types: $types, minHp: $minHp, maxHp: $maxHp) {
      monsters {
        id
        name
      }
    }
  }
`;

/**
 * - `GET_MONSTER_REVIEWS`: Fetches reviews associated with a specific monster.
 *   - Query Parameters:
 *     - `monsterId` (required): Unique identifier of the monster.
 *   - Query Response:
 *     - `monster`: Object containing:
 *       - `id`: Monster identifier.
 *       - `reviews`: List of review objects with:
 *         - `id`: Review identifier.
 *         - `user`: Reviewer details with:
 *           - `id`: User identifier.
 *           - `userName`: Name of the reviewer.
 *         - `difficulty`: Difficulty rating of the monster.
 *         - `description`: Text of the review.
 *         - `createdAt`: Timestamp of the review creation.
 */
export const GET_MONSTER_REVIEWS = gql`
  query GetMonsterReviews($monsterId: ID!) {
    monster(id: $monsterId) {
      id
      reviews {
        id
        user {
          id
          userName
        }
        difficulty
        description
        createdAt
      }
    }
  }
`;
