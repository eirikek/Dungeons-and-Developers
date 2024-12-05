import { gql } from '@apollo/client';

/**
 * UserMutations
 *
 * Provides GraphQL mutations for managing user-related data in the application.
 *
 * Features:
 * - User creation and login.
 * - Equipment management (add, remove, remove all).
 * - Monster management (favorite, unfavorite).
 * - Dungeon management (update dungeon name).
 * - Ability scores and character class/race updates.
 *
 * Mutations:
 * - `CREATE_USER`: Creates a new user and initializes their data.
 * - `LOGIN_USER`: Logs in an existing user and fetches their associated data.
 * - `ADD_EQUIPMENT_TO_CHARACTER`: Adds equipment to the user's character.
 * - `REMOVE_EQUIPMENT_FROM_CHARACTER`: Removes specific equipment from the user's character.
 * - `REMOVE_ALL_EQUIPMENTS`: Removes all equipment from the user's character.
 * - `ADD_FAVORITE_MONSTER`: Adds a monster to the user's favorites.
 * - `REMOVE_FAVORITE_MONSTER`: Removes a monster from the user's favorites.
 * - `UPDATE_DUNGEON_NAME`: Updates the name of the user's dungeon.
 * - `UPDATE_ABILITY_SCORES`: Updates the user's ability scores.
 * - `UPDATE_USER_CLASS`: Updates the user's class.
 * - `UPDATE_USER_RACE`: Updates the user's race.
 */

// Create or login a user
export const CREATE_USER = gql`
  mutation createUser($userName: String!) {
    createUser(userName: $userName) {
      token
      user {
        id
        userName
        class {
          name
        }
        race {
          name
        }
        abilityScores {
          ability {
            id
            name
          }
          score
        }
        equipments {
          name
        }
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($userName: String!) {
    loginUser(userName: $userName) {
      token
      user {
        id
        userName
        class {
          name
        }
        race {
          name
        }
        abilityScores {
          ability {
            id
            name
          }
          score
        }
        equipments {
          name
        }
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
  }
`;

// Equipments
export const ADD_EQUIPMENT_TO_CHARACTER = gql`
  mutation AddEquipmentToCharacter($userId: ID!, $equipmentId: ID!) {
    addEquipmentToCharacter(userId: $userId, equipmentId: $equipmentId) {
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

export const REMOVE_EQUIPMENT_FROM_CHARACTER = gql`
  mutation RemoveEquipmentFromCharacter($userId: ID!, $equipmentId: ID!) {
    removeEquipmentFromCharacter(userId: $userId, equipmentId: $equipmentId) {
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

export const REMOVE_ALL_EQUIPMENTS = gql`
  mutation RemoveAllEquipments($userId: ID!) {
    removeAllEquipments(userId: $userId) {
      id
      equipments {
        id
        name
        category
        value
      }
    }
  }
`;

// Monsters
export const ADD_FAVORITE_MONSTER = gql`
  mutation AddFavoriteMonster($userId: ID!, $monsterId: ID!) {
    addFavoriteMonster(userId: $userId, monsterId: $monsterId) {
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

export const REMOVE_FAVORITE_MONSTER = gql`
  mutation RemoveFavoriteMonster($userId: ID!, $monsterId: ID!) {
    removeFavoriteMonster(userId: $userId, monsterId: $monsterId) {
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

// Dungeon Name
export const UPDATE_DUNGEON_NAME = gql`
  mutation UpdateDungeonName($userId: ID!, $dungeonName: String!) {
    updateDungeonName(userId: $userId, dungeonName: $dungeonName) {
      id
      dungeonName
    }
  }
`;

// Ability Scores
export const UPDATE_ABILITY_SCORES = gql`
  mutation UpdateAbilityScores($userId: ID!, $scores: [Int!]!) {
    updateAbilityScores(userId: $userId, scores: $scores) {
      id
      abilityScores {
        ability {
          id
          name
          index
          skills
        }
        score
      }
    }
  }
`;

// Class
export const UPDATE_USER_CLASS = gql`
  mutation UpdateUserClass($userId: ID!, $classId: ID!) {
    updateUserClass(userId: $userId, classId: $classId) {
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

// Race
export const UPDATE_USER_RACE = gql`
  mutation UpdateUserRace($userId: ID!, $raceId: ID!) {
    updateUserRace(userId: $userId, raceId: $raceId) {
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
