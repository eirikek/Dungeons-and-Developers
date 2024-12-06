import MonsterGraphQL from '../interfaces/MonsterDataProps.ts';

/**
 * Query Interfaces
 *
 * Defines TypeScript interfaces for handling GraphQL responses and variables related to user data and operations.
 *
 * Interfaces:
 *
 * - **UserFavorites**: Represents the user's favorited monsters.
 *   - `user`: Object containing:
 *     - `id`: User ID.
 *     - `favoritedMonsters`: Array of `MonsterGraphQL` objects.
 *
 * - **UserFavoritesVars**: Variables required for fetching user favorites.
 *   - `userId`: The unique identifier of the user.
 *
 * - **AddFavoriteResponse**: Response for adding a monster to the user's favorites.
 *   - `addFavoriteMonster`: Object containing:
 *     - `id`: User ID.
 *     - `favoritedMonsters`: Array of updated `MonsterGraphQL` objects.
 *
 * - **RemoveFavoriteResponse**: Response for removing a monster from the user's favorites.
 *   - `removeFavoriteMonster`: Object containing:
 *     - `id`: User ID.
 *     - `favoritedMonsters`: Array of updated `MonsterGraphQL` objects.
 *
 * - **UserClass**: Represents the user's class data.
 *   - `user`: Object containing:
 *     - `id`: User ID.
 *     - `class`: Object with:
 *       - `id`: Class ID.
 *       - `name`: Class name.
 *       - `index`: Class index.
 *       - `hit_die`: Class hit die.
 *
 * - **UserRace**: Represents the user's race data.
 *   - `user`: Object containing:
 *     - `id`: User ID.
 *     - `race`: Object with:
 *       - `id`: Race ID.
 *       - `name`: Race name.
 *       - `speed`: Movement speed.
 *       - `alignment`: Race alignment.
 *       - `size`: Race size.
 *       - `img`: Race image URL.
 *
 * - **UserAbilities**: Represents the user's ability scores.
 *   - `user`: Object containing:
 *     - `id`: User ID.
 *     - `abilityScores`: Array of objects with:
 *       - `ability`: Object with `id` and `name`.
 *       - `score`: Numerical score.
 *
 * - **Ability**: Represents an individual ability.
 *   - `id`: Ability ID.
 *   - `name`: Ability name.
 *
 * - **AbilityScorePair**: Represents a pair of ability and its score.
 *   - `__typename`: GraphQL type name.
 *   - `ability`: `Ability` object.
 *   - `score`: Numerical score.
 *
 * - **ArrayScores**: Response structure for fetching array scores.
 *   - `getArrayScores`: Array of `AbilityScorePair` objects.
 *
 * - **ArrayVar**: Variables required for fetching array scores.
 *   - `userId`: The unique identifier of the user.
 *
 * - **GetUserEquipmentResponse**: Response structure for fetching the user's equipment.
 *   - `user`: Object containing:
 *     - `id`: User ID.
 *     - `equipments`: Array of equipment objects with:
 *       - `id`: Equipment ID.
 *       - `index`: Equipment index.
 *       - `name`: Equipment name.
 *       - `category`: Equipment category.
 *       - `value`: Equipment value.
 *       - `__typename`: GraphQL type name.
 */

export interface UserFavorites {
  user: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

export interface AddFavoriteResponse {
  addFavoriteMonster: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

export interface RemoveFavoriteResponse {
  removeFavoriteMonster: {
    id: string;
    favoritedMonsters: MonsterGraphQL[];
  };
}

export interface UserClass {
  user: {
    id: string;
    class: {
      id: string;
      name: string;
      index: string;
      hit_die: number;
    };
  };
}

export interface UserRace {
  user: {
    id: string;
    race: {
      id: string;
      name: string;
      speed: number;
      alignment: string;
      size: string;
      img: string;
    };
  };
}

export interface Ability {
  id: string;
  name: string;
}

export interface AbilityScorePair {
  __typename: string;
  ability: Ability;
  score: number;
}

export interface ArrayScores {
  getArrayScores: AbilityScorePair[];
}

export type ArrayVar = {
  userId: string;
};

export interface GetUserEquipmentResponse {
  user: {
    id: string;
    equipments: Array<{
      id: string;
      index: number;
      name: string;
      category: string;
      value: number;
      __typename: string;
    }>;
  };
}
