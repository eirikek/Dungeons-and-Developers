import { gql } from '@apollo/client';

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites($userId: ID!) {
    user(id: $userId) {
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
      }
    }
  }
`;
export const GET_USER_CLASS = gql`
  query GetUserClass($userId: ID!) {
    user(id: $userId) {
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
