import { gql } from '@apollo/client';

export const GET_ABILITYSCORES = gql`
  query GetAbilityScores($offset: Int, $limit: Int) {
    abilities(offset: $offset, limit: $limit) {
      abilities {
        index
        name
        skills
      }
      totalAbilities
    }
  }
`;
