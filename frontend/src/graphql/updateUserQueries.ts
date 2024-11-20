import { gql } from '@apollo/client';

export const UPDATE_DUNGEON_NAME = gql`
  mutation UpdateDungeonName($userId: ID!, $dungeonName: String!) {
    updateDungeonName(userId: $userId, dungeonName: $dungeonName) {
      id
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
          index
          skills
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
        id
        name
        index
        hit_die
      }
    }
  }
`;
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
        img
      }
    }
  }
`;
