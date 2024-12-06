import { gql } from '@apollo/client';

/**
 * User Queries
 *
 * Features:
 * - Retrieves user-related data, including favorites, class, race, equipment, and more.
 * - Supports username validation and dungeon management.
 */

/**
 * - `GET_USER_FAVORITES`: Fetches a user's favorited monsters.
 *   - Query Parameters:
 *     - `userId`: The unique identifier of the user.
 *   - Query Response:
 *     - `user`: The user object containing:
 *       - `id`: User ID.
 *       - `favoritedMonsters`: Array of favorited monsters with attributes like `id`, `name`, `size`, `type`, `alignment`, `hit_points`, and `image`.
 */
export const GET_USER_FAVORITES = gql`
  query GetUserFavorites($userId: ID!) {
    user(id: $userId) {
      id
      favoritedMonsters {
        id
        name
        size
        type
        alignment
        hit_points
        image
      }
    }
  }
`;

/**
 * - `CHECK_USERNAME`: Validates whether a username is available.
 *   - Query Parameters:
 *     - `userName`: The username to check.
 *   - Query Response:
 *     - Boolean indicating availability.
 */
export const CHECK_USERNAME = gql`
  query checkUsername($userName: String!) {
    checkUsername(userName: $userName)
  }
`;

/**
 * - `GET_USER_CLASS`: Retrieves the user's class details.
 *   - Query Parameters:
 *     - `userId`: The unique identifier of the user.
 *   - Query Response:
 *     - `user`: Object containing:
 *       - `id`: User ID.
 *       - `class`: Object with `id`, `name`, `index`, and `hit_die`.
 */
export const GET_USER_CLASS = gql`
  query GetUserClass($userId: ID!) {
    user(id: $userId) {
      id
      class {
        id
        name
        index
        hit_die
      }
    }
  }
`;

/**
 * - `GET_USER_RACE`: Retrieves the user's race details.
 *   - Query Parameters:
 *     - `userId`: The unique identifier of the user.
 *   - Query Response:
 *     - `user`: Object containing:
 *       - `id`: User ID.
 *       - `race`: Object with `id`, `name`, `speed`, `alignment`, and `size`.
 */
export const GET_USER_RACE = gql`
  query GetUserRace($userId: ID!) {
    user(id: $userId) {
      id
      race {
        id
        name
        speed
        alignment
        size
      }
    }
  }
`;

/**
 * - `GET_ARRAY_SCORES`: Fetches the user's ability scores.
 *   - Query Parameters:
 *     - `userId`: The unique identifier of the user.
 *   - Query Response:
 *     - `getArrayScores`: Array of scores with:
 *       - `ability`: Object with `id` and `name`.
 *       - `score`: Numerical score value.
 */
export const GET_ARRAY_SCORES = gql`
  query GetArrayScores($userId: ID!) {
    getArrayScores(userId: $userId) {
      ability {
        id
        name
      }
      score
    }
  }
`;

/**
 * - `GET_USER_EQUIPMENT`: Fetches the user's equipment.
 *   - Query Parameters:
 *     - `userId`: The unique identifier of the user.
 *   - Query Response:
 *     - `user`: Object containing:
 *       - `id`: User ID.
 *       - `equipments`: Array of equipment objects with `id`, `index`, `name`, `category`, and `value`.
 */
export const GET_USER_EQUIPMENT = gql`
  query GetUserEquipment($userId: ID!) {
    user(id: $userId) {
      id
      equipments {
        id
        index
        name
        category
        value
      }
    }
  }
`;

/**
 * - `GET_USER_DUNGEON_NAME`: Retrieves the user's dungeon name.
 *   - Query Parameters:
 *     - `userId`: The unique identifier of the user.
 *   - Query Response:
 *     - `user`: Object containing:
 *       - `id`: User ID.
 *       - `dungeonName`: Name of the user's dungeon.
 */
export const GET_USER_DUNGEON_NAME = gql`
  query GetUserDungeon($userId: ID!) {
    user(id: $userId) {
      id
      dungeonName
    }
  }
`;
