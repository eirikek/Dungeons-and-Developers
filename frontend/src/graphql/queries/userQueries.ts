import { gql } from '@apollo/client';

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

export const CHECK_USERNAME = gql`
  query checkUsername($userName: String!) {
    checkUsername(userName: $userName)
  }
`;

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
        img
      }
    }
  }
`;
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

export const GET_USER_DUNGEON_NAME = gql`
  query GetUserDungeon($userId: ID!) {
    user(id: $userId) {
      id
      dungeonName
    }
  }
`;
