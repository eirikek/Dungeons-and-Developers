import { gql } from '@apollo/client';

export const ADD_FAVORITE_MONSTER = gql`
  mutation AddFavoriteMonster($userId: ID!, $monsterId: ID!) {
    addFavoriteMonster(userId: $userId, monsterId: $monsterId) {
      favoritedMonsters {
        id
      }
    }
  }
`;

export const REMOVE_FAVORITE_MONSTER = gql`
  mutation RemoveFavoriteMonster($userId: ID!, $monsterId: ID!) {
    removeFavoriteMonster(userId: $userId, monsterId: $monsterId) {
      favoritedMonsters {
        id
      }
    }
  }
`;
