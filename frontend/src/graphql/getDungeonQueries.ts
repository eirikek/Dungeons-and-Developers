import { gql } from '@apollo/client';

export const GET_USER_DUNGEON = gql`
  query GetUserDungeon($userId: ID!) {
    user(id: $userId) {
      dungeonName
      favoritedMonsters {
        id
      }
    }
  }
`;
