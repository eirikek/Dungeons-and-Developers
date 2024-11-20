import { gql } from '@apollo/client';

export const UPDATE_DUNGEON_NAME = gql`
  mutation UpdateDungeonName($userId: ID!, $dungeonName: String!) {
    updateDungeonName(userId: $userId, dungeonName: $dungeonName) {
      dungeonName
    }
  }
`;

export const UPDATE_ABILITY_SCORES = gql`
  mutation UpdateAbilityScores($userId: ID!, $scores: [Int!]!) {
    updateAbilityScores(userId: $userId, scores: $scores) {
      id
      abilityScores {
        ability {
          id
          name
        }
        score
      }
    }
  }
`;
export const UPDATE_USER_CLASS = gql`
  mutation UpdateUserClass($userId: ID!, $classId: ID!) {
    updateUserClass(userId: $userId, classId: $classId) {
      id
      class {
        name
        index
        hit_die
      }
    }
  }
`;
export const UPDATE_USER_RACE = gql`
  mutation UpdateUserRace($userId: ID!, $raceId: [ID!]!) {
    updateUserRace(userId: $userId, raceId: $raceId) {
      id
      race {
        name
        speed
        alignment
        size
        img
      }
    }
  }
`;
